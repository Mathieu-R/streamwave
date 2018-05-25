import { EventEmitter } from 'events';
import store from '../store';
import { toasting } from '../store/toast';

class Uploader extends EventEmitter {
  constructor (url, files) {
    super();
    this.onSuccess = this.onSuccess.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onUploadSucessed = this.onUploadSucessed.bind(this);
    this.onUploadFinished = this.onUploadFinished.bind(this);
    this.onError = this.onError.bind(this);

    this.upload(url, files);
  }

  // fetch does not support upload progress //
  // streams only works for download-progress //
  // waiting for FetchObserver //
  upload (url, files) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('authorization', `Bearer ${localStorage.getItem('streamwave-token')}`);
    xhr.send(files);

    xhr.addEventListener('load', this.onSuccess);
    xhr.upload.addEventListener('progress', this.onProgress);
    xhr.upload.addEventListener('load', this.onUploadSucessed);
    xhr.upload.addEventListener('loadend', this.onUploadFinished);
    xhr.addEventListener('error', this.onError);
  }

  onSuccess (evt) {
    if (evt.target.status === 200) {

    } else {

    }
  }

  onProgress (evt) {
    console.log(evt);
    if (!evt.lengthComputable) {
      console.warn('[Upload Progress] Unknown total size.');
      return;
    }

    // const customEvent = new CustomEvent('upload-progress', {
    //   bubbles: true,
    //   detail: {
    //     uploaded: evt.loaded,
    //     total: evt.total
    //   },
    //   cancelable: true
    // });

    this.emit('upload-progress', {
      uploaded: evt.loaded,
      total: evt.total
    });
  }

  // fire when upload success
  onUploadSucessed () {
    store.dispatch(toasting([
      'Fichiers envoyés avec succès',
      'Votre album sera bientôt disponible dans votre catalogue'
    ], ['dismiss'], 5000));
  }

  // loadend event
  // fire whenever
  // upload success or fails
  // leverage this to remove progress bar
  onUploadFinished () {
    this.emit('upload-finished');
  }

  onError (evt) {
    console.error(evt.responseText);
  }
}

export default Uploader;
