import { GeoJsonLayerProps } from '@deck.gl/layers';
import { GeoJsonLayer, PickInfo } from 'deck.gl';

export const makeDeckGlGeoJsonLayer = <T>(
  map: google.maps.Map<Element> | null,
  features: T[],
  id: string,
): GeoJsonLayer<T, GeoJsonLayerProps<T>> | undefined => {

  const ICON_MAPPING = {
      marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
  };

  return new GeoJsonLayer({
      id,
      data: features,
      pickable: true,
      pointType: 'icon',
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: ICON_MAPPING,
      getIcon: () => 'marker',
      getIconSize: () => 5,
      iconSizeScale: 8,
      onClick: (info: PickInfo<T>) => {
          console.log(info);
      },
      onHover: (info: PickInfo<T>) => {
          if (!map) return;
          map.setOptions({ draggableCursor: info.object ? 'pointer' : 'grab' });

          console.log(info);
      },
  });
};
