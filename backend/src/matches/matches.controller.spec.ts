import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, EntityNotFoundError } from 'typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { PageDto, PageMetaDto, PageOptionsDto, takeDefault } from '@dtos/pages';
import {
  CreateMatchDto,
  ResponseMatchDto,
  MatchDto,
  MatchStatusType,
} from '@dtos/matches';
import { User } from 'src/users/entities/user.entity';
import { Match } from './entities/match.entity';
import { NotificationsGateway } from 'src/notifications.gateway';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Friendship } from 'src/relationships/entities/friendship.entity';
import { Block } from 'src/relationships/entities/block.entity';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { Membership } from 'src/memberships/entities/membership.entity';

describe('MatchesController', () => {
  let controller: MatchesController;
  let service: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        MatchesService,
        NotificationsGateway,
        UsersService,
        ConfigService,
        {
          provide: getRepositoryToken(Match),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Friendship),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Block),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(AchievementsLog),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Channel),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Membership),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return an array of messages', async () => {
      const expected = new PageDto(
        Array(5).fill(new MatchDto()),
        new PageMetaDto(new PageOptionsDto(), takeDefault),
      );
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);
      const result = await controller.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findOne()', () => {
    it('should return a message', async () => {
      const mockOut = new MatchDto();
      const expected = new ResponseMatchDto();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne('1');
      expect(result).toEqual(expected);
    });

    it('should return 404 if match not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(EntityNotFoundError);
      expect(controller.findOne('5')).rejects.toThrow();
    });
  });

  describe('create()', () => {
    it('should return a ResponseMatchDto with a status of IN_PROGRESS', async () => {
      const match = new MatchDto();
      match.homeId = 2;
      match.awayId = 3;
      match.status = MatchStatusType.IN_PROGRESS;
      const createMatchDto = new CreateMatchDto();
      createMatchDto.homeId = 2;
      createMatchDto.awayId = 3;
      jest.spyOn(service, 'create').mockImplementation(async () => {
        return match;
      });
      const result = await controller.create(createMatchDto);
      expect(result).toEqual(match);
    });
    it('should return Bad Request if a user does not exist or if the home user is the away user', async () => {
      const createMatchDto = new CreateMatchDto();
      createMatchDto.homeId = 2;
      createMatchDto.awayId = 3;
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new EntityNotFoundError('User #2 not found', ''),
        );
      const result = controller.create(createMatchDto);
      expect(result).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('remove()', () => {
    it('should return a DeleteResult', async () => {
      const expected = new DeleteResult();
      jest.spyOn(service, 'remove').mockImplementation(async () => expected);
      const result = await controller.remove('1');
      expect(result).toBe(expected);
    });
  });
});
