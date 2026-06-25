import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Member, MemberRole } from '../entities/member.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockMemberRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepo,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password and create member', async () => {
      const member = { id: '1', email: 'test@test.com', name: 'Test', role: MemberRole.PARTICIPANT } as Member;
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockMemberRepo.create.mockReturnValue(member);
      mockMemberRepo.save.mockResolvedValue(member);

      const result = await service.register('test@test.com', 'password', 'Test');
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(result).toEqual(member);
    });
  });

  describe('login', () => {
    it('should return token and member on valid credentials', async () => {
      const member = { id: '1', email: 'test@test.com', passwordHash: 'hash', role: MemberRole.PARTICIPANT } as Member;
      mockMemberRepo.findOne.mockResolvedValue(member);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('token123');

      const result = await service.login('test@test.com', 'password');
      expect(result.accessToken).toBe('token123');
      expect(result.member).toEqual(member);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      mockMemberRepo.findOne.mockResolvedValue(null);

      await expect(service.login('test@test.com', 'wrong')).rejects.toThrow(UnauthorizedException);
    });
  });
});
