import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ImageLibrary } from '@/lib/models';
import { saveUploadedFile, parseFormData, validateImageFile } from '@/lib/upload';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = getSessionFromRequest(req);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await parseFormData(req);
    const imageFile = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    // Validate file exists
    if (!imageFile) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    const validation = validateImageFile(imageFile);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Save file
    const imageUrl = await saveUploadedFile(imageFile);

    // Connect to database and save metadata
    await connectToDatabase();

    const image = new ImageLibrary({
      imageUrl,
      title: title || imageFile.name,
      description: description || '',
      category: category || 'uncategorized',
      uploadDate: new Date(),
    });

    await image.save();

    return NextResponse.json(
      {
        message: 'Image uploaded successfully',
        image: {
          id: image._id,
          imageUrl: image.imageUrl,
          title: image.title,
          description: image.description,
          category: image.category,
          uploadDate: image.uploadDate,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
}
