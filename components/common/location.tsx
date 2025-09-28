import { default as NYCMTABullet, type NYCMTABulletProps } from './nyc-mta-bullet';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type LocationProps = {
  location: string;
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const Location: React.FC<LocationProps> = ({ location }) => {
  const [a, b] = location.toLowerCase().split('|');

  if (a === 'nyc_mta') {
    type Line = NYCMTABulletProps['line'];
    let [name, bullets, url]: [string | null, string | null, string | null] = [null, null, null];

    // prettier-ignore
    if (b === 'elmhurst') [name, bullets, url] = ['Elmhurst Avenue', 'M,R', 'https://maps.app.goo.gl/Aseo9eyMTWwzBnYM7'];
    // prettier-ignore
    if (b === '77th_st_irt') [name, bullets, url] = ['77th Street', '6', 'https://maps.app.goo.gl/a3AjbbxA71N8jC8b6'];
    // prettier-ignore
    if (b === 'west_4th') [name, bullets, url] = ['West 4 Street–Washington Square', 'A,C,E,B,D,F,M', 'https://maps.app.goo.gl/dUjQGxSkzv7YkUCk8'];
    // prettier-ignore
    if (b === 'dyckman_ind') [name, bullets, url] = ['Dyckman Street', 'A', 'https://maps.app.goo.gl/CxTkByPynRGk9CAd9'];

    if (name && bullets) {
      if (url) {
        return (
          <a
            href={url}
            className="pointer-events-auto ml-4 flex items-center gap-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* prettier-ignore */}
            <div className="font-helvetica select-none text-xl font-medium line-clamp-1">{name}</div>
            <div className="flex flex-wrap items-center gap-1">
              {bullets.split(',').map((bullet) => (
                <NYCMTABullet key={`${b}-${bullet}`} line={bullet as Line} size={24} />
              ))}
            </div>
          </a>
        );
      }
      return (
        <div className="ml-4 flex items-center gap-2">
          {/* prettier-ignore */}
          <div className="font-helvetica select-none text-xl font-medium">{name}</div>
          <div className="flex items-center gap-1">
            {bullets.split(',').map((bullet) => (
              <NYCMTABullet key={`${b}-${bullet}`} line={bullet as Line} size={24} />
            ))}
          </div>
        </div>
      );
    }
  }

  // Return null if nothing is supported.
  return null;
};

export default Location;
