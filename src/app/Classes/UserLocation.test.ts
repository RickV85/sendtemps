import { makeUserLocation } from '@/test/factories';

import { UserLocation } from './UserLocation';

describe('UserLocation', () => {
  describe('constructor', () => {
    it('assigns all provided properties', () => {
      const loc = new UserLocation(
        1,
        'Test',
        '40',
        '-74',
        'u1',
        'climb',
        '2024-01-01',
        '2024-01-01',
      );
      expect(loc.date_created).toBe('2024-01-01');
      expect(loc.id).toBe(1);
      expect(loc.last_modified).toBe('2024-01-01');
      expect(loc.latitude).toBe('40');
      expect(loc.longitude).toBe('-74');
      expect(loc.name).toBe('Test');
      expect(loc.poi_type).toBe('climb');
      expect(loc.user_id).toBe('u1');
    });

    it('defaults null dates to current ISO string', () => {
      const before = new Date().toISOString();
      const loc = new UserLocation(1, 'Test', '40', '-74', 'u1', 'climb', null, null);
      const after = new Date().toISOString();
      expect(loc.date_created >= before && loc.date_created <= after).toBe(true);
      expect(loc.last_modified >= before && loc.last_modified <= after).toBe(true);
    });

    it('sets id to undefined when falsy (0)', () => {
      const loc = new UserLocation(0 as unknown as number, 'T', '0', '0', 'u', 'climb', null, null);
      expect(loc.id).toBeUndefined();
    });
  });

  describe('updateName', () => {
    it('updates name when 50 chars or fewer', () => {
      const loc = makeUserLocation();
      loc.updateName('New Name');
      expect(loc.name).toBe('New Name');
    });

    it('updates name with exactly 50 characters', () => {
      const loc = makeUserLocation();
      const name = 'a'.repeat(50);
      loc.updateName(name);
      expect(loc.name).toBe(name);
    });

    it('rejects name longer than 50 characters', () => {
      const loc = makeUserLocation();
      const original = loc.name;
      const spy = jest.spyOn(console, 'log').mockImplementation();
      loc.updateName('a'.repeat(51));
      expect(loc.name).toBe(original);
      spy.mockRestore();
    });

    it('rejects empty string', () => {
      const loc = makeUserLocation();
      const original = loc.name;
      const spy = jest.spyOn(console, 'log').mockImplementation();
      loc.updateName('');
      expect(loc.name).toBe(original);
      spy.mockRestore();
    });
  });

  describe('updatePOIType', () => {
    it('sets the new type', () => {
      const loc = makeUserLocation({ poi_type: 'climb' });
      loc.updatePOIType('ski');
      expect(loc.poi_type).toBe('ski');
    });
  });

  describe('updateLastModified', () => {
    it('sets last_modified to current ISO string', () => {
      const loc = makeUserLocation({ last_modified: '2020-01-01T00:00:00.000Z' });
      const before = new Date().toISOString();
      loc.updateLastModified();
      const after = new Date().toISOString();
      expect(loc.last_modified >= before && loc.last_modified <= after).toBe(true);
    });
  });
});
