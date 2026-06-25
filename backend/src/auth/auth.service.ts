import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Member, MemberRole } from '../entities/member.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member) private memberRepo: Repository<Member>,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string, name: string, role: MemberRole = MemberRole.PARTICIPANT, birthDate?: Date, gender?: string): Promise<Member> {
    const passwordHash = await bcrypt.hash(password, 10);
    const member = this.memberRepo.create({ email, passwordHash, name, role, birthDate, gender });
    return this.memberRepo.save(member);
  }

  async login(email: string, password: string): Promise<{ accessToken: string; member: Member }> {
    const member = await this.memberRepo.findOne({ where: { email } });
    if (!member || !(await bcrypt.compare(password, member.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: member.id, email: member.email, role: member.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, member };
  }

  async findById(id: string): Promise<Member | null> {
    return this.memberRepo.findOne({ where: { id } });
  }

  async promoteToStaff(memberId: string): Promise<Member> {
    const member = await this.memberRepo.findOne({ where: { id: memberId } });
    if (!member) {
      throw new Error('Member not found');
    }
    member.role = MemberRole.STAFF;
    return this.memberRepo.save(member);
  }

  async getAllMembers(): Promise<Member[]> {
    return this.memberRepo.find({
      order: { name: 'ASC' }
    });
  }

  async changeRole(memberId: string, role: MemberRole): Promise<Member> {
    const member = await this.memberRepo.findOne({ where: { id: memberId } });
    if (!member) {
      throw new Error('Member not found');
    }
    member.role = role;
    return this.memberRepo.save(member);
  }
}
