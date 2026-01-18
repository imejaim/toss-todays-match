// react-native 모킹 - 브라우저 개발 환경용
// 토스 앱에서는 실제 react-native가 사용됨

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noop = (): any => { };
const noopComponent = (): null => null;

export const Platform = { OS: 'web', select: noop };
export const StyleSheet = { create: (styles: unknown) => styles, flatten: noop };
export const View = noopComponent;
export const Text = noopComponent;
export const Image = noopComponent;
export const TouchableOpacity = noopComponent;
export const ScrollView = noopComponent;
export const Dimensions = { get: () => ({ width: 0, height: 0 }) };
export const Animated = {
    View: noopComponent,
    Text: noopComponent,
    Value: class { },
    timing: noop,
    spring: noop,
};
export const NativeModules = {};
export const requireNativeComponent = noop;
export const findNodeHandle = noop;
export const StatusBar = noopComponent;

export default {
    Platform,
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    Animated,
    NativeModules,
};
