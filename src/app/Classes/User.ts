export class User {
  id: number;
  email: string;
  name: string;
  last_login: string;
  date_created: string;
  last_modified: string;

  constructor(id: number, email: string, name: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.last_login = new Date().toISOString();
    this.date_created = new Date().toISOString();
    this.last_modified = new Date().toISOString();
  }

  updateEmail(email: string) {
    this.email = email;
  }

  updateName(name: string) {
    this.name = name;
  }

  updateLastLoginToNow() {
    this.last_login = new Date().toISOString();
  }

  updateLastModifiedToNow() {
    this.last_modified = new Date().toISOString();
  }
}