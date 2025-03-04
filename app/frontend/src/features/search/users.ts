import { MapClickedCallback } from "features/search/constants";
import { Point } from "geojson";
import {
  AnyLayer,
  AnySourceData,
  GeoJSONSource,
  Map as MaplibreMap,
} from "maplibre-gl";

import userPin from "./resources/userPin.png";

const URL = process.env.REACT_APP_API_BASE_URL;

type SourceKeys = "all-objects" | "clustered-users";
export const sources: Record<SourceKeys, AnySourceData> = {
  "all-objects": {
    cluster: false,
    data: URL + "/geojson/users",
    promoteId: "id",
    type: "geojson",
  },
  "clustered-users": {
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
    data: URL + "/geojson/users",
    type: "geojson",
  },
};

type LayerKeys =
  | "clusterCountLayer"
  | "clusterLayer"
  | "unclusteredPointLayer"
  | "users";
export const layers: Record<LayerKeys, AnyLayer> = {
  clusterCountLayer: {
    filter: ["has", "point_count"],
    id: "clusters-count",
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-size": 12,
    },
    source: "clustered-users",
    type: "symbol",
  },
  clusterLayer: {
    filter: ["has", "point_count"],
    id: "clusters",
    paint: {
      // step expression: https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#step
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        100,
        "#f1f075",
        750,
        "#f28cb1",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
    source: "clustered-users",
    type: "circle",
  },
  unclusteredPointLayer: {
    filter: ["!", ["has", "point_count"]],
    id: "unclustered-points",
    layout: {
      "icon-image": "user-pin",
      "icon-allow-overlap": true,
    },
    source: "clustered-users",
    type: "symbol",
  },

  users: {
    filter: ["!", ["has", "point_count"]],
    id: "users",
    layout: {
      "icon-image": "user-pin",
      "icon-allow-overlap": true,
    },
    paint: {
      "icon-opacity": [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        1,
        0.5,
      ],
    },
    source: "all-objects",
    type: "symbol",
  },
};

const addPinImages = (map: MaplibreMap) => {
  map.loadImage(userPin, (error: Error, image: HTMLImageElement) => {
    if (error) {
      throw error;
    }
    map.addImage("user-pin", image);
  });
};

const zoomCluster = (
  ev: mapboxgl.MapMouseEvent & {
    features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
  } & mapboxgl.EventData
) => {
  const map = ev.target;
  const cluster = ev.features?.[0];
  if (!cluster || !cluster.properties?.cluster_id) return;
  (map.getSource("clustered-users") as GeoJSONSource).getClusterExpansionZoom(
    cluster.properties.cluster_id,
    (_error, zoom) => {
      map.flyTo({
        center: (cluster.geometry as Point).coordinates as [number, number],
        zoom,
      });
    }
  );
};

export const addClusteredUsersToMap = (
  map: MaplibreMap,
  userClickedCallback?: MapClickedCallback
) => {
  map.addSource("clustered-users", sources["clustered-users"]);
  addPinImages(map);
  map.addLayer(layers["clusterLayer"]);
  map.addLayer(layers["clusterCountLayer"]);
  map.addLayer(layers["unclusteredPointLayer"]);
  if (userClickedCallback) {
    map.on("click", layers["unclusteredPointLayer"].id, userClickedCallback);
  }
  map.on("click", layers["clusterLayer"].id, zoomCluster);
};

export const addUsersToMap = (
  map: MaplibreMap,
  userClickedCallback?: MapClickedCallback
) => {
  map.addSource("all-objects", sources["all-objects"]);
  addPinImages(map);
  map.addLayer(layers["users"]);

  if (userClickedCallback) {
    map.on("click", layers["users"].id, userClickedCallback);
  }
};
