
export interface AnalysisResult {
  interpretation: string;
  suggestedCodes?: string[];
  imageAnnotations?: ImageAnnotation[];
}

export interface ImageAnnotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

export interface AppWireframe {
  screens: ScreenDefinition[];
  components: ComponentDefinition[];
  dataFlow: DataFlowDefinition[];
  nativeFeatures: NativeFeatureDefinition[];
}

export interface ScreenDefinition {
  id: string;
  name: string;
  route: string;
  components: string[];
  description: string;
}

export interface ComponentDefinition {
  id: string;
  name: string;
  description: string;
  props?: string[];
  androidSpecific?: boolean;
}

export interface DataFlowDefinition {
  id: string;
  source: string;
  destination: string;
  dataType: string;
  description: string;
}

export interface NativeFeatureDefinition {
  id: string;
  name: string;
  androidPermission?: string;
  capacitorPlugin?: string;
  description: string;
}

export interface AndroidAppWireframe {
  appName: string;
  appId: string;
  screens: ScreenDefinition[];
  components: ComponentDefinition[];
  nativeFeatures: NativeFeatureDefinition[];
  dataFlow: DataFlowDefinition[];
  stateManagement: string;
  apiIntegration: string[];
  buildConfiguration: {
    targetSdk: number;
    minSdk: number;
    buildTools: string;
    capacitorVersion: string;
  };
}
