import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Karma } from '../../karmas/entities/karma.entity';
import { Message } from '../../messages/entities/message.entity';
import { ChannelType } from '../entities/channel.entity';

export class ChannelDto {
  @ApiProperty({
    description: 'The id of a channel',
  })
  @IsPositive()
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'The unique channel name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The channel type',
    type: ChannelType,
    enum: ChannelType,
    enumName: 'ChannelType',
    isArray: false,
    examples: [ChannelType.PUBLIC, ChannelType.PROTECTED, ChannelType.PRIVATE],
  })
  @IsEnum(ChannelType, { each: true })
  type: ChannelType;

  @ApiProperty({
    description: 'A password for a PROTECTED channel',
  })
  password?: string;
}
