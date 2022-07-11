import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { BlockTypeEnum } from '../../entities/block.entity';

export class QueryBlockDto {
  @ApiPropertyOptional({
    description: 'Source User Id',
  })
  @IsOptional()
  @IsNumberString()
  sourceId?: string;

  @ApiPropertyOptional({
    description: 'Target User Id',
  })
  @IsOptional()
  @IsNumberString()
  targetId?: string;

  @ApiPropertyOptional({
    description: 'Status',
  })
  @IsOptional()
  @IsEnum(BlockTypeEnum)
  status?: BlockTypeEnum;
}
