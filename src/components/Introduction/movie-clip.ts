import { transform } from 'framer-motion';

const scale = 1.1;

export const marks = {
  enterScreen: 0.1,
  beginFirstPoint: 0.2,
  beginFirstScale: 0.3,
  endFirstScale: 0.4,
  endFirstPoint: 0.5,
  beginSecondPoint: 0.6,
  beginSecondScale: 0.7,
  endSecondScale: 0.8,
  endSecondPoint: 0.9,
  exitScreen: 1
};

export function mapPosX(ratio: number, width: number): number {
  const enterPosX = width / 2;
  const FirstPosX = width / 8;
  const SecondPosX = -FirstPosX;
  const exitPosX = -enterPosX;

  const {
    enterScreen,
    beginFirstPoint,
    endFirstPoint,
    beginSecondPoint,
    endSecondPoint,
    exitScreen
  } = marks;

  return ratio <= enterScreen
    ? enterPosX
    : ratio <= beginFirstPoint
    ? transform(ratio, [enterScreen, beginFirstPoint], [enterPosX, FirstPosX])
    : ratio <= endFirstPoint
    ? FirstPosX
    : ratio <= beginSecondPoint
    ? transform(ratio, [endFirstPoint, beginSecondPoint], [FirstPosX, SecondPosX])
    : ratio <= endSecondPoint
    ? SecondPosX
    : ratio <= exitScreen
    ? transform(ratio, [endSecondPoint, exitScreen], [SecondPosX, exitPosX])
    : exitPosX;
}

export function mapFirstImgScale(ratio: number) {
  const { beginFirstPoint, beginFirstScale, endFirstScale, endFirstPoint } = marks;

  return ratio <= beginFirstPoint
    ? 1
    : ratio <= beginFirstScale
    ? transform(ratio, [beginFirstPoint, beginFirstScale], [1, scale])
    : ratio <= endFirstScale
    ? scale
    : ratio <= endFirstPoint
    ? transform(ratio, [endFirstScale, endFirstPoint], [scale, 1])
    : 1;
}

export function mapSecondImgScale(ratio: number) {
  const { beginSecondPoint, beginSecondScale, endSecondScale, endSecondPoint } = marks;

  return ratio <= beginSecondPoint
    ? 1
    : ratio <= beginSecondScale
    ? transform(ratio, [beginSecondPoint, beginSecondScale], [1, scale])
    : ratio <= endSecondScale
    ? scale
    : ratio <= endSecondPoint
    ? transform(ratio, [endSecondScale, endSecondPoint], [scale, 1])
    : 1;
}
