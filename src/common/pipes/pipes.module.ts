import { Module } from '@nestjs/common';
import { GlobalValidationPipe } from './validation.pipe';

@Module({
    providers: [GlobalValidationPipe],
    exports: [GlobalValidationPipe],
})
export class PipesModule { }