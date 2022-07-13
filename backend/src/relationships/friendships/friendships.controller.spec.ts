import { Test, TestingModule } from '@nestjs/testing';
import UserRepository from 'src/users/repository/user.repository';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ResponseFriendshipDto } from './dto/response-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import { Friendship } from '../entities/friendship.entity';
import { FriendshipsController } from './friendships.controller';
import { FriendshipsService } from './friendships.service';
import { FriendshipRepository } from './repositories/friendship.repository';

describe('FriendshipsController', () => {
  let controller: FriendshipsController;
  let service: FriendshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendshipsController],
      providers: [FriendshipsService, FriendshipRepository, UserRepository],
    }).compile();

    controller = module.get<FriendshipsController>(FriendshipsController);
    service = module.get<FriendshipsService>(FriendshipsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne()', () => {
    it('should return a Friendship', async () => {
      const mockOut = new Friendship();
      jest.spyOn(service, 'findOne').mockImplementation(async () => mockOut);
      const result = await controller.findOne('1');
      expect(result).toEqual(new ResponseFriendshipDto());
    });
  });

  describe('update()', () => {
    it('should return a ResponseFriendshipDto', async () => {
      const mock = new UpdateResult();
      const dto = new UpdateFriendshipDto();
      jest.spyOn(service, 'update').mockImplementation(async () => mock);
      const result = await controller.update('1', dto);
      expect(result).toEqual(mock);
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
