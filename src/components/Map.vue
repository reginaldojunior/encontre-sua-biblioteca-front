<template>
  <div>  
    <div class="wrapper ">
      <div class="sidebar" data-color="purple" data-background-color="black" data-image="../assets/img/sidebar-2.jpg">
        <div class="logo">
          <a href="#" class="simple-text logo-normal">
            Encontre Sua Biblioteca
          </a>
        </div>
        <div class="sidebar-wrapper">
          <ul class="nav">
            <li class="nav-item active ">
              <a class="nav-link" href="/">
                <i class="material-icons">location_ons</i>
                <p>Bibliotecas</p>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="javascript:;" v-on:click="show()">
                <i class="material-icons">add</i>
                <p>Adicionar Biblioteca</p>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="main-panel">
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top " id="navigation-example">
          <div class="container-fluid">
            <div class="navbar-wrapper">
              <a class="navbar-brand" href="javascript:void(0)">Bibliotecas</a>
            </div>
            <button class="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation" data-target="#navigation-example">
              <span class="sr-only">Toggle navigation</span>
              <span class="navbar-toggler-icon icon-bar"></span>
              <span class="navbar-toggler-icon icon-bar"></span>
              <span class="navbar-toggler-icon icon-bar"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end">
              <form class="navbar-form">
                <div class="input-group no-border">
                  <input type="text" value="" class="form-control" placeholder="Procure por nome...">
                  <button type="submit" class="btn btn-default btn-round btn-just-icon">
                    <i class="material-icons">search</i>
                    <div class="ripple-container"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </nav>
        
        <!-- End Navbar -->
        <div id="map">
          <gmap-map
            :center="center"
            :zoom="12"
            style="width:100%;  height: 720px;"
          >
            <gmap-marker
              :key="index"
              v-for="(m, index) in markers"
              :position="m.position"
              @click="center=m.position"
            ></gmap-marker>
          </gmap-map>
        </div>

        <modal name="my-first-modal" styles="background-color: #202940;" height="520">
          <div class="card">
            <div class="card-header card-header-primary">
              <h4 class="card-title">Adicione uma nova Biblioteca</h4>
              <p class="card-category">Estará disponivel em 48 horas após a verificação.</p>
            </div>
            <div class="card-body">
              <form>
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group bmd-form-group">
                      <input type="text" class="form-control" placeholder="Nome" v-model="dataLibrary.name">
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-8">
                    <div class="form-group bmd-form-group">
                      <input type="text" class="form-control" placeholder="Endereço" v-model="dataLibrary.andress">
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group bmd-form-group">
                      <input type="text" class="form-control" placeholder="Bairro" v-model="dataLibrary.neighborhood">
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group bmd-form-group">
                      <input type="text" class="form-control" placeholder="UF" v-model="dataLibrary.state">
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group bmd-form-group">
                      <input type="text" class="form-control" placeholder="Cidade" v-model="dataLibrary.city">
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group bmd-form-group">
                      <input type="text" class="form-control" placeholder="CEP" v-model="dataLibrary.zipcode">
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label>Descrição</label>
                      <div class="form-group bmd-form-group">
                        <textarea class="form-control" rows="5" v-model="dataLibrary.description"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <a v-on:click="createLibrary" class="btn btn-primary pull-right">Criar Biblioteca</a>
                <div class="clearfix"></div>
              </form>
            </div>
          </div>
        </modal>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import config from '../../config/env'

export default {
  name: "Map",
  data() {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: [],
      currentPlace: null,
      dataLibrary: {
        name: '',
        andress: '',
        neighborhood: '',
        state: '',
        zipcode: '',
        description: ''
      }
    };
  },

  mounted() {
    console.log(config);
    this.geolocate();
  },

  methods: {
    show () {
      this.$modal.show('my-first-modal');
    },
    hide () {
      this.$modal.hide('my-first-modal');
    },
    async createLibrary () {
      let geocode = await this.getLatLongByAndress();
      let url = config.URL_BACKEND + '/v1/library'
      let data = {
        name: this.dataLibrary.name,
        description: this.dataLibrary.description,
        image_src: '',
        latitude: geocode.lat,
        longitude: geocode.long
      }

      let res = await axios.post(url, data)
      if (res.status == 200) {
        this.hide();
        this.$swal('Sucesso', 'Sua biblioteca foi salva com sucesso, em até 48 horas estará disponivel no site', 'success');
      } else {
        this.hide();
        this.$swal('Erro', 'Ocorreu um erro, tente novamente, caso persista, reporte no nosso Github', 'error');
      }
    },
    async getLatLongByAndress() {
      let endereco = encodeURI(`${this.dataLibrary.andress},${this.dataLibrary.neighborhood},${this.dataLibrary.state},${this.dataLibrary.zipcode}`);
      let key = config.KEY_GMAPS;
      let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + endereco + '&sensor=false&key=' + key;

      let res = await axios.get(url);
      let lat = res.data.results[0].geometry.location.lat;
      let long = res.data.results[0].geometry.location.lng;

      return { lat: lat, long: long }
    },
    // receives a place object via the autocomplete component
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  position: relative;
  margin-top: 80px;
  height: 720px;
}
.v--modal {
  background-color: #202940 !important;
}
</style>
