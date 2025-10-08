import { Fragment } from 'react';

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
    if (b === '116th_8th_ind') [name, bullets, url] = ['116 Street', 'B,C', 'https://maps.app.goo.gl/iBWtMuSwJkeWCdVE6'];
    // prettier-ignore
    if (b === '14th_6th_bmt') [name, bullets, url] = ['6 Avenue', 'L', 'https://maps.app.goo.gl/mLoC56CjYEUZ8uyq9'];
    // prettier-ignore
    if (b === '14th_6th_irt') [name, bullets, url] = ['14 Street', '1,2,3', 'https://maps.app.goo.gl/vW373pkXUTQRmwn5A'];
    // prettier-ignore
    if (b === '23rd_8th_ind') [name, bullets, url] = ['23 Street', 'C,E', 'https://maps.app.goo.gl/ukxduoRrgyJtm3UKA'];
    // prettier-ignore
    if (b === '51st_st') [name, bullets, url] = ['51 Street', '6', 'https://maps.app.goo.gl/jL7hxLpKnsxKjWFe8'];
    // prettier-ignore
    if (b === '77th_st_irt') [name, bullets, url] = ['77 Street', '6', 'https://maps.app.goo.gl/a3AjbbxA71N8jC8b6'];
    // prettier-ignore
    if (b === 'carroll_st') [name, bullets, url] = ['Carroll Street', 'F,G', 'https://maps.app.goo.gl/QBWjdAwKrEwXaN4a9'];
    // prettier-ignore
    if (b === 'dyckman_ind') [name, bullets, url] = ['Dyckman Street', 'A', 'https://maps.app.goo.gl/CxTkByPynRGk9CAd9'];
    // prettier-ignore
    if (b === 'elmhurst') [name, bullets, url] = ['Elmhurst Avenue', 'M,R', 'https://maps.app.goo.gl/Aseo9eyMTWwzBnYM7'];
    // prettier-ignore
    if (b === 'halsey_canarsie') [name, bullets, url] = ['Halsey Street', 'L', 'https://maps.app.goo.gl/XdmKPigSas1jpdcA9'];
    // prettier-ignore
    if (b === 'west_4th') [name, bullets, url] = ['West 4 Street', 'A,C,E,B,D,F,M', 'https://maps.app.goo.gl/szF3tauihixngssUA'];

    if (name && bullets) {
      const children = (
        <Fragment>
          {/* prettier-ignore */}
          <div className="font-helvetica select-none text-xl font-medium text-nowrap">{name}</div>
          <div className="flex items-center gap-1">
            {bullets.split(',').map((bullet) => (
              <NYCMTABullet key={`${b}-${bullet}`} line={bullet as Line} size={24} />
            ))}
          </div>
        </Fragment>
      );

      return (
        <div
          className="hide-scrollbar pointer-events-auto relative h-7 overflow-x-auto pl-2 pr-4 md:pr-6"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 0.5rem, black calc(100% - 0.5rem), transparent)',
            maskImage:
              'linear-gradient(to right, transparent, black 0.5rem, black calc(100% - 0.5rem), transparent)',
          }}
        >
          {url ? (
            <a
              href={url}
              className="flex w-fit items-center gap-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ) : (
            <div className="flex w-fit items-center gap-2">{children}</div>
          )}
        </div>
      );
    }
  }

  // Return null if nothing is supported.
  return null;
};

export default Location;
