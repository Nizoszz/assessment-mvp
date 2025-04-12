import { IsNotEmpty, IsString } from 'class-validator';

export class AnalyseRequestDto {
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  jobDescription: string;
}
