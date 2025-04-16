import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

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
export class RecruiterView {
  @Expose()
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  alignmentView: string;

  @Expose()
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  misalignmentView: string;

  @Expose()
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  attentionView: string;
}

export class AnalyseResultResponseDto {
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

  @Expose()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => RecruiterView)
  recruiterView: RecruiterView;
}
