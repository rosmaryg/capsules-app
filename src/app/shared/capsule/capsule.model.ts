export class Capsule {
  title: string;
  id: string;
  description: string;
  img: string;
  createdTimeStamp: number;
  lastUpdatedTimeStamp: number;
  hover: boolean;
  meta: {
    topic: string;
    difficulty: string;
    author: string;
    hasVideos: boolean;
    hasActivities: boolean;
    tags: Array<string>;
  }
}
