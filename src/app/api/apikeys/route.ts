import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  APIKeyCreateSchema,
  APIKeyCreateResponseSchema,
  APIKeyReadSchema
} from '@/lib/schemas/apiKey';
import { ZodError } from 'zod';
import crypto from 'crypto'; // For generating random bytes
import bcrypt from 'bcryptjs'; // For hashing the API key

const API_KEY_PREFIX = 'sk_'; // Simple prefix, can be made more complex
const API_KEY_LENGTH = 32; // Length of the random part of the key

// Helper function to generate a secure API key and its prefix
function generateAPIKey(): { apiKey: string; prefix: string; randomKeyPart: string } {
  const randomBytes = crypto.randomBytes(API_KEY_LENGTH);
  const randomKeyPart = randomBytes.toString('hex').slice(0, API_KEY_LENGTH * 2 - 8); // Adjust length for hex
  const prefix = `${API_KEY_PREFIX}${crypto.randomBytes(4).toString('hex')}_`; // e.g., sk_a1b2c3d4_
  const apiKey = `${prefix}${randomKeyPart}`;
  return { apiKey, prefix, randomKeyPart };
}

/**
 * @swagger
 * /api/apikeys:
 * post:
 * summary: Create a new API Key
 * description: Generates a new API key, hashes it for storage, and returns the original key once.
 * tags:
 * - API Keys
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/APIKeyCreateInput'
 * responses:
 * 201:
 * description: API Key created successfully. The full API key is returned only once.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/APIKeyCreateResponseOutput'
 * 400:
 * description: Invalid input data.
 * 500:
 * description: Internal server error.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = APIKeyCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { description, expiresAt, isActive } = validationResult.data;

    const { apiKey, prefix, randomKeyPart } = generateAPIKey();

    // Hash the random part of the key for storage
    // The salt round factor (e.g., 10) determines the complexity.
    const saltRounds = 10;
    const hashedKey = await bcrypt.hash(apiKey, saltRounds); // Hash the full key for simplicity here

    const newAPIKeyRecord = await prisma.apiKey.create({
      data: {
        prefix,
        hashedKey, // Store the hash of the full key
        description,
        expiresAt,
        isActive,
        // lastUsedAt will be null initially
      },
    });

    // Prepare the response, including the original unhashed API key
    const responseData: Zod.infer<typeof APIKeyCreateResponseSchema> = {
      id: newAPIKeyRecord.id,
      prefix: newAPIKeyRecord.prefix,
      description: newAPIKeyRecord.description,
      isActive: newAPIKeyRecord.isActive,
      createdAt: newAPIKeyRecord.createdAt,
      expiresAt: newAPIKeyRecord.expiresAt,
      lastUsedAt: newAPIKeyRecord.lastUsedAt,
      apiKey: apiKey, // Return the full, unhashed API key
    };

    return NextResponse.json(APIKeyCreateResponseSchema.parse(responseData), { status: 201 });

  } catch (error) {
    console.error('Failed to create API key:', error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error during processing', details: error.errors },
        { status: 400 }
      );
    }
    // Handle potential Prisma unique constraint violation if prefix generation isn't perfectly unique (rare)
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        const target = (error as any).meta?.target as string[] | undefined;
        if (target && target.includes('prefix')) {
             return NextResponse.json({ error: "API key prefix conflict. Please try again." }, { status: 409 });
        }
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


/**
 * @swagger
 * /api/apikeys:
 * get:
 * summary: List API Keys (metadata only)
 * description: Retrieves a list of API key metadata (excluding the actual keys).
 * tags:
 * - API Keys
 * parameters:
 * - in: query
 * name: skip
 * schema:
 * type: integer
 * default: 0
 * description: Number of records to skip for pagination.
 * - in: query
 * name: take
 * schema:
 * type: integer
 * default: 20
 * description: Maximum number of records to return.
 * responses:
 * 200:
 * description: A list of API key metadata.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/APIKeyReadOutput'
 * 500:
 * description: Internal server error.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const take = parseInt(searchParams.get('take') || '20', 10);

    if (isNaN(skip) || isNaN(take) || skip < 0 || take < 0 || take > 100) {
        return NextResponse.json({ error: "Invalid pagination parameters. 'skip' must be >= 0, 'take' must be between 0 and 100." }, { status: 400 });
    }

    const apiKeyRecords = await prisma.apiKey.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: skip,
      take: take,
      // Select only fields that are safe to return (covered by APIKeyReadSchema)
      // Prisma will automatically only fetch what's needed if you parse with a Zod schema
      // that omits fields, but explicit select can be clearer.
    });

    const responseData = apiKeyRecords.map(key => APIKeyReadSchema.parse(key));
    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Failed to retrieve API keys:', error);
     if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error during output processing', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


// Add to your Swagger components definition
/**
 * @swagger
 * components:
 * schemas:
 * APIKeyCreateInput:
 * type: object
 * properties:
 * description:
 * type: string
 * maxLength: 255
 * nullable: true
 * isActive:
 * type: boolean
 * default: true
 * expiresAt:
 * type: string
 * format: date-time
 * nullable: true
 * APIKeyReadOutput:
 * type: object
 * properties:
 * id:
 * type: string
 * format: uuid
 * prefix:
 * type: string
 * description:
 * type: string
 * nullable: true
 * isActive:
 * type: boolean
 * createdAt:
 * type: string
 * format: date-time
 * lastUsedAt:
 * type: string
 * format: date-time
 * nullable: true
 * expiresAt:
 * type: string
 * format: date-time
 * nullable: true
 * APIKeyCreateResponseOutput:
 * allOf: # Inherits from APIKeyReadOutput
 * - $ref: '#/components/schemas/APIKeyReadOutput'
 * - type: object
 * properties:
 * apiKey:
 * type: string
 * description: The full generated API key. Store this securely, it will not be shown again.
 */
