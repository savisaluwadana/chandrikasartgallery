import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ImageLibrary } from '@/lib/models';
import { deleteUploadedFile } from '@/lib/upload';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const image = await ImageLibrary.findById(params.id);

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const image = await ImageLibrary.findByIdAndDelete(params.id);

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete the uploaded file from disk
    try {
      if (image.imageUrl && image.imageUrl.startsWith('/uploads/')) {
        const fileName = image.imageUrl.split('/').pop();
        if (fileName) {
          await deleteUploadedFile(fileName);
        }
      }
    } catch (fileError) {
      console.error('Error deleting file from disk:', fileError);
      // Continue anyway - database record is deleted
    }

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete image' },
      { status: 500 }
    );
  }
}
