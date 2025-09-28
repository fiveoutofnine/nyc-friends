// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type NYCMTABulletProps = {
  line:
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | 'A'
    | 'C'
    | 'E'
    | 'S'
    | 'B'
    | 'D'
    | 'F'
    | 'M'
    | 'G'
    | 'J'
    | 'Z'
    | 'L'
    | 'N'
    | 'Q'
    | 'R'
    | 'W'
    | 'T';
  size?: number;
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const NYCMTABullet: React.FC<NYCMTABulletProps> = ({ line, size = 20 }) => {
  const background: Record<typeof line, string> = {
    '1': '#ee352e',
    '2': '#ee352e',
    '3': '#ee352e',
    '4': '#00933c',
    '5': '#00933c',
    '6': '#00933c',
    '7': '#b933ad',
    A: '#0039a6',
    C: '#0039a6',
    E: '#0039a6',
    S: '#808183',
    B: '#ff6319',
    D: '#ff6319',
    F: '#ff6319',
    M: '#ff6319',
    G: '#6cbe45',
    J: '#996633',
    Z: '#996633',
    L: '#a7a9ac',
    N: '#fccc0a',
    Q: '#fccc0a',
    R: '#fccc0a',
    W: '#fccc0a',
    T: '#00add0',
  };
  const color: Record<typeof line, string> = {
    '1': 'white',
    '2': 'white',
    '3': 'white',
    '4': 'white',
    '5': 'white',
    '6': 'white',
    '7': 'white',
    A: 'white',
    C: 'white',
    E: 'white',
    S: 'white',
    B: 'white',
    D: 'white',
    F: 'white',
    M: 'white',
    G: 'white',
    J: 'white',
    Z: 'white',
    L: 'white',
    N: 'black',
    Q: 'black',
    R: 'black',
    W: 'black',
    T: 'white',
  };

  return (
    <div
      /* prettier-ignore */
      className="font-helvetica flex select-none items-center justify-center rounded-full font-medium"
      style={{
        background: background[line],
        color: color[line],
        width: size,
        height: size,
        fontSize: size / 1.5,
      }}
      aria-label={`NYC MTA ${line} line`}
      role="img"
    >
      {line}
    </div>
  );
};

export default NYCMTABullet;
