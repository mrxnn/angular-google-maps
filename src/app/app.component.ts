import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import {  } from 'google-maps'; // not a mistake 😆

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // basic map properties
  @ViewChild('gmap') gmapElement: ElementRef;
  map: google.maps.Map;

  // properties related to adding markers
  @ViewChild('addMarkerField') addMarkerField: ElementRef;
  markers: google.maps.Marker[] = [];

  // properties related to directions logic
  @ViewChild('startingPointField') startingPointField: ElementRef;
  @ViewChild('endingPointField') endingPointField: ElementRef;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  startingPointLatLng: google.maps.LatLng;
  endingPointLatLng: google.maps.LatLng;

  ngOnInit() {
    this.initMap();
    this.initMarkers();
    this.initDirections();
  }

  // initialize the basic map
  initMap() {
    let props: google.maps.MapOptions = {
      center: new google.maps.LatLng(6.927630, 79.859296),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.gmapElement.nativeElement, props);
  }

  // initialize the add markers logic
  initMarkers() {
    const addMarkerField = new google.maps.places.Autocomplete(this.addMarkerField.nativeElement, {
      types: [],
      componentRestrictions: { country: 'LK' } // limit the results to a specific country: Eg: Sri Lanka (LK)
    });

    addMarkerField.addListener('place_changed', () => {
      const place = addMarkerField.getPlace();
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: this.map
      });
      this.markers.push(marker);
    });
  }

  // initialize the logic related to directions services
  initDirections() {
    this.directionsRenderer.setMap(this.map);
    const autocompleteProps = { types: [], componentRestrictions: { country: 'LK' } }
    const startField = new google.maps.places.Autocomplete(this.startingPointField.nativeElement, autocompleteProps);
    const endField = new google.maps.places.Autocomplete(this.endingPointField.nativeElement, autocompleteProps);

    startField.addListener('place_changed', () => this.startingPointLatLng = startField.getPlace().geometry.location);
    endField.addListener('place_changed', () => this.endingPointLatLng = endField.getPlace().geometry.location);
  }

  // controls the type of map: roadmap, terrain, satellite, hybrid
  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId);
  }

  // remove all the markers from the map
  removeAllMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  // find directions from one location to another
  findRoute() {
    const directionsRequest: google.maps.DirectionsRequest = {
      origin: this.startingPointLatLng,
      destination: this.endingPointLatLng,
      travelMode: google.maps.TravelMode.DRIVING
    }
    this.directionsService.route(directionsRequest, (result, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
      }
    });
  }
}
