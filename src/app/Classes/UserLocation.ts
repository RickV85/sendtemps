export class UserLocation {
  name: string;
  latitude: string;
  longitude: string;
  user_id: string;
  poi_type: string;
  date_created: string;
  last_modified: string;

  constructor(
    name: string,
    latitude: string,
    longitude: string,
    user_id: string,
    poi_type: string,
    date_created: string | null,
    last_modified: string | null
  ) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.user_id = user_id;
    this.poi_type = poi_type;
    this.date_created = date_created || new Date().toISOString();
    this.last_modified = last_modified || new Date().toISOString();
  }

  updateName(newName: string) {
    if (newName && newName.length <= 50) {
      this.name = newName;
    } else {
      console.log(
        "newName for UserLocation must be 50 characters or less. Name not updated."
      );
    }
  }

  updatePOIType(newType: string) {
    this.poi_type = newType;
  }

  updateLastModified() {
    this.last_modified = new Date().toISOString();
  }
}
