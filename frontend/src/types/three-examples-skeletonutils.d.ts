declare module 'three/examples/jsm/utils/SkeletonUtils.js' {
    import { Object3D } from 'three';

    export function clone<T extends Object3D = Object3D>(source: T): T;
} 