export type DropNavItem = {
  id: string;
  name: string;
  slug: string;
  children?: {
    id: string;
    name: string;
    slug: string;
    is_editorial: boolean;
  }[];
};
