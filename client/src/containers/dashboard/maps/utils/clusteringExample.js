/*
 * Copyright 2019 Teralytics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import * as Cluster from '@flowmap.gl/cluster';
import { Flow, FlowAccessors, isFeatureCollection, Location, LocationAccessors } from '@flowmap.gl/core';
import React from 'react';
import { ViewState } from '@flowmap.gl/core';
import Example from './Example';
import { relativeTimeThreshold } from 'moment';
import turf from 'turf';

// export interface Props extends FlowAccessors, LocationAccessors {
//   flows: Flow[];
//   locations: Location[];
//   clusterLevels?: Cluster.ClusterLevel[];
// }

// interface State {
//   clusteredLocations: Location[] | undefined;
//   aggregateFlows: Flow[] | undefined;
// }

class ClusteringExample extends React.Component {
  constructor(props) {
    super(props);
    const {clusterIndex, aggregateFlowsByZoom, maxZoom} = this.aggregate()
    this.state = {
      clusteredLocations: clusterIndex.getClusterNodesFor(maxZoom),
      aggregateFlows: aggregateFlowsByZoom.get(maxZoom),
      flows: this.props.flows
    };
  }

  aggregate() {
    const { flows, getLocationId, getLocationCentroid, getFlowOriginId, getFlowDestId, getFlowMagnitude } = this.props;
    let clusterLevels;
    const locations = isFeatureCollection(this.props.locations) ? this.props.locations.features : this.props.locations;
    if (this.props.clusterLevels) {
      clusterLevels = this.props.clusterLevels;
    } else {
      const getLocationWeight = Cluster.makeLocationWeightGetter(flows, {
        getFlowOriginId,
        getFlowDestId,
        getFlowMagnitude,
      });
      clusterLevels = Cluster.clusterLocations(locations, { getLocationId, getLocationCentroid }, getLocationWeight, {
        makeClusterName: (id, numPoints) => `Cluster #${id} of ${numPoints} locations`,
      });
    }
    const clusterIndex = Cluster.buildIndex(clusterLevels);
    const aggregateFlowsByZoom = new Map();
    for (const zoom of clusterIndex.availableZoomLevels) {
      aggregateFlowsByZoom.set(
        zoom,
        clusterIndex.aggregateFlows(this.props.flows, zoom, { getFlowOriginId, getFlowDestId, getFlowMagnitude }),
      );
    }
    const maxZoom = Math.max.apply(null, clusterIndex.availableZoomLevels);
    return {clusterIndex, aggregateFlowsByZoom, maxZoom}
  }

  handleViewStateChange = (viewState) => {
    const {clusterIndex, aggregateFlowsByZoom, maxZoom} = this.aggregate()
    const { availableZoomLevels } = clusterIndex;
    const { zoom } = viewState;
    const clusterZoom = Cluster.findAppropriateZoomLevel(availableZoomLevels, zoom);
    this.setState({
      clusteredLocations: clusterIndex.getClusterNodesFor(clusterZoom),
      aggregateFlows: aggregateFlowsByZoom.get(clusterZoom),
      flows: this.props.flows
    });
  };

  render() {
    const { getFlowOriginId, getFlowDestId, getFlowMagnitude } = this.props;
    const { clusteredLocations, aggregateFlows } = this.state;
    // console.log(turf.centroid(turf.polygon(clusteredLocations[0])))
    if (!clusteredLocations || !aggregateFlows) {
      return null;
    }
    return (
      <Example
        locations={clusteredLocations}
        flows={aggregateFlows}
        getLocationId={(loc) => loc.id}
        getLocationCentroid={(loc) => loc.centroid}
        getFlowOriginId={(flow) => (Cluster.isAggregateFlow(flow) ? flow.origin : getFlowOriginId(flow))}
        getFlowDestId={(flow) => (Cluster.isAggregateFlow(flow) ? flow.dest : getFlowDestId(flow))}
        getFlowMagnitude={(flow) => (Cluster.isAggregateFlow(flow) ? flow.count : getFlowMagnitude(flow))}
        onViewStateChange={this.handleViewStateChange}
      />
    );
  }
}

export default ClusteringExample;

// export interface Props extends FlowAccessors, LocationAccessors {
//   flows: Flow[];
//   locations: Location[];
//   clusterLevels?: Cluster.ClusterLevel[];
// }

// interface State {
//   clusteredLocations: Location[] | undefined;
//   aggregateFlows: Flow[] | undefined;
// }
// export default function ClusteringExample(props) {
//   const { flows, getLocationId, getLocationCentroid, getFlowOriginId, getFlowDestId, getFlowMagnitude } = props;
//   console.log('flows',flows)
//   let clusterLevels;
//   const locations = isFeatureCollection(props.locations) ? props.locations.features : props.locations;
//   if (props.clusterLevels) {
//     clusterLevels = props.clusterLevels;
//   } else {
//     const getLocationWeight = Cluster.makeLocationWeightGetter(flows, {
//       getFlowOriginId,
//       getFlowDestId,
//       getFlowMagnitude,
//     });
//     clusterLevels = Cluster.clusterLocations(locations, { getLocationId, getLocationCentroid }, getLocationWeight, {
//       makeClusterName: (id, numPoints) => `Cluster #${id} of ${numPoints} locations`,
//     });
//   }
//   const clusterIndex = Cluster.buildIndex(clusterLevels);
//   const aggregateFlowsByZoom = new Map();
//   for (const zoom of clusterIndex.availableZoomLevels) {
//     aggregateFlowsByZoom.set(
//       zoom,
//       clusterIndex.aggregateFlows(flows, zoom, { getFlowOriginId, getFlowDestId, getFlowMagnitude }),
//     );
//   }
//   const maxZoom = Math.max.apply(null, clusterIndex.availableZoomLevels);
//   const [clusteredLocations, setClusteredLocations] = useState(clusterIndex.getClusterNodesFor(maxZoom));
//   const [aggregateFlows, setAggregateFlows] = useState(aggregateFlowsByZoom.get(maxZoom));


//   const handleViewStateChange = (viewState) => {
//     const { availableZoomLevels } = clusterIndex;
//     const { zoom } = viewState;
//     const clusterZoom = Cluster.findAppropriateZoomLevel(availableZoomLevels, zoom);
//     setClusteredLocations(clusterIndex.getClusterNodesFor(clusterZoom));
//     setAggregateFlows(aggregateFlowsByZoom.get(clusterZoom))
//   };

//   if (!clusteredLocations || !aggregateFlows) {
//     return null;
//   }
//   return (
//     <Example
//       locations={clusteredLocations}
//       flows={aggregateFlows}
//       getLocationId={(loc) => loc.id}
//       getLocationCentroid={(loc) => loc.centroid}
//       getFlowOriginId={(flow) => (Cluster.isAggregateFlow(flow) ? flow.origin : getFlowOriginId(flow))}
//       getFlowDestId={(flow) => (Cluster.isAggregateFlow(flow) ? flow.dest : getFlowDestId(flow))}
//       getFlowMagnitude={(flow) => (Cluster.isAggregateFlow(flow) ? flow.count : getFlowMagnitude(flow))}
//       onViewStateChange={handleViewStateChange}
//     />
//   );
// }