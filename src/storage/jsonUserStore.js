import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export class JsonUserStore {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getOrCreate(phoneNumber) {
    const users = await this.readAll();
    if (!users[phoneNumber]) {
      users[phoneNumber] = {
        phoneNumber,
        createdAt: new Date().toISOString(),
      };
      await this.writeAll(users);
    }
    return users[phoneNumber];
  }

  async save(user) {
    const users = await this.readAll();
    users[user.phoneNumber] = {
      ...user,
      updatedAt: new Date().toISOString(),
    };
    await this.writeAll(users);
  }

  async readAll() {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      return JSON.parse(raw);
    } catch (error) {
      if (error.code === 'ENOENT') return {};
      throw error;
    }
  }

  async writeAll(users) {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(users, null, 2));
  }
}
