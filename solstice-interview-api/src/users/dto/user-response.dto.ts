import { ApiProperty } from '@nestjs/swagger';

import { Role } from '../../common/enums/role.enum.js';

/**
 * Public account representation shared by users and authentication responses, based on SDD section 8.4.
 */
export class UserResponseDto {
  @ApiProperty({ description: 'User UUID', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({
    description: 'Account email address, nullable for social-only accounts',
    nullable: true,
    example: 'jane@example.com',
  })
  email: string | null;

  @ApiProperty({ description: 'Whether the account email has been verified', example: true })
  emailVerified: boolean;

  @ApiProperty({ description: 'User full name', example: 'Jane Doe' })
  fullName: string;

  @ApiProperty({
    description: 'Avatar image URL, when configured',
    nullable: true,
    example: 'https://cdn.example.com/avatars/jane.jpg',
  })
  avatarUrl: string | null;

  @ApiProperty({
    description: 'Account role',
    enum: Role,
    enumName: 'Role',
    example: Role.User,
  })
  role: Role;

  @ApiProperty({ description: 'Whether the account has a password configured', example: true })
  hasPassword: boolean;

  @ApiProperty({
    description: 'Account creation timestamp in ISO 8601 UTC format',
    format: 'date-time',
    example: '2026-10-26T13:00:00.000Z',
  })
  createdAt: Date;
}
