export class User {
  id: string;
  email: string;
  name: string;
  last_login: string | null;
  date_created: string | null;
  last_modified: string | null;

  constructor(
    id: string,
    email: string,
    name: string,
    last_login: string | null,
    date_created: string | null,
    last_modified: string | null
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.last_login = last_login || new Date().toISOString();
    this.date_created = date_created || new Date().toISOString();
    this.last_modified = last_modified || new Date().toISOString();
  }

  updateEmail(newEmail: string) {
    if (newEmail && newEmail.length <= 100) {
      this.email = newEmail;
    } else {
      console.log(
        "newEmail for User must be 100 characters or less. Email not updated."
      );
    }
  }

  updateName(newName: string) {
    if (newName && newName.length <= 100) {
      this.name = newName;
    } else {
      console.log(
        "newName for User must be 100 characters or less. Name not updated."
      );
    }
  }

  updateLastLoginToNow() {
    this.last_login = new Date().toISOString();
  }

  updateLastModifiedToNow() {
    this.last_modified = new Date().toISOString();
  }
}
