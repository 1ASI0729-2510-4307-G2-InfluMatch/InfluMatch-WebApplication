// src/app/core/core.module.ts
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AuthRepository } from '../domain/repositories/auth-repository';
import { AuthRepositoryImpl } from '../infrastructure/repositories/auth.repository';

import { ProfileRepository } from '../domain/repositories/profile-repository';
import { ProfileRepositoryImpl } from '../infrastructure/repositories/profile.repository';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    // tu auth
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    // ¡añade el profile aquí!
    { provide: ProfileRepository, useClass: ProfileRepositoryImpl },
  ],
})
export class CoreModule {}
