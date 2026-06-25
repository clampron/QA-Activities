import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';

describe('EventsService', () => {
  let service: EventsService;
  let repo: Repository<Event>;

  const mockRepo = {
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repo = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of events', async () => {
      const events = [{ id: '1', title: 'Test Event' }] as Event[];
      mockRepo.find.mockResolvedValue(events);

      const result = await service.findAll();
      expect(result).toEqual(events);
      expect(mockRepo.find).toHaveBeenCalledWith({
        order: { startDate: 'ASC' }
      });
    });
  });

  describe('create', () => {
    it('should create and save an event', async () => {
      const eventData = { title: 'New Event', startDate: new Date(), endDate: new Date(), maxRegistrations: 50 };
      const savedEvent = { id: '1', ...eventData } as Event;
      
      mockRepo.create.mockReturnValue(savedEvent);
      mockRepo.save.mockResolvedValue(savedEvent);

      const result = await service.create(eventData);
      expect(result).toEqual(savedEvent);
      expect(mockRepo.create).toHaveBeenCalledWith(eventData);
      expect(mockRepo.save).toHaveBeenCalledWith(savedEvent);
    });
  });
});
