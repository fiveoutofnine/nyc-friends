import probe from 'probe-image-size';

const getImageDimensions = async (url: string) => {
  try {
    const result = await probe(url);
    return {
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Failed to fetch image dimensions:', error);

    return null;
  }
};

export default getImageDimensions;
