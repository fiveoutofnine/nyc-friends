## nyc-friends

Online museum of [friend.com](https://friend.com) reviews by NYC: [nyc-friends.vercel.app](https://nyc-friends.vercel.app).

## Development

### Installation

```bash
git clone https://github.com/fiveoutofnine/nyc-friends.git
pnpm install
pnpm run dev
```

### Configuration

This project uses [Drizzle](https://orm.drizzle.team) as its ORM, which stores the image URLs and their metadata.
Install and set that up:

```sh
echo DATABASE_URL=$DATABASE_URL > .env
npx drizzle-kit generate
npx drizzle-kit push
```

Then, configure the domain you're serving the images from in [`next.config.ts`](https://github.com/fiveoutofnine/nyc-friends/blob/ad5511508edf56a2832887e906e2d534f96b5178/next.config.ts#L11):

```ts
const nextConfig: NextConfig = {
  images: {
    domains: ['nyc-friends-assets.fiveoutofnine.com'],
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};
```

### Adding/editing location tags

Images have an [optional `location` metadata field](https://github.com/fiveoutofnine/nyc-friends/blob/ad5511508edf56a2832887e906e2d534f96b5178/lib/db/schema.ts#L86) you can configure in the database to label images on the UI.
To add, delete, or edit locations, edit the [`<Location />` component](https://github.com/fiveoutofnine/nyc-friends/blob/ad5511508edf56a2832887e906e2d534f96b5178/components/common/location.tsx).
You can use whatever naming schema you'd like, but make sure it's synced.
This project uses the following:

```
# Template: {location}|{sub-location}
# Example :  nyc_mta|west_4th
```
