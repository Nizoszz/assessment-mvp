import { Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class AnalyseResultResponseDto {
  @Expose()
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  classification: string;

  @Expose()
  @IsNotEmpty()
  @IsArray({ message: 'Must be an array' })
  @IsString({ each: true, message: 'Each item must be a string' })
  strongPoints: string[];

  @Expose()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PointToImprove)
  pointsToImprove: PointToImprove[];

  @Expose()
  @IsNotEmpty()
  @IsArray({ message: 'Must be an array' })
  @IsString({ each: true, message: 'Each item must be a string' })
  resumeSuggestions: string[];

  @Expose()
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  matchScore: string;

  @Expose()
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  createdAt: string;
}

export class PointToImprove {
  @Expose()
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  description: string;

  @Expose()
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  studyRecommendation: string;
}
