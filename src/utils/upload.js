import { EventEmitter } from 'events';
import store from '../store';
import { toasting } from '../store/toast';

class Uploader extends EventEmitter {
  constructor (url, files) {
    super();
    this.xhr = null;

    this.onSuccess = this.onSuccess.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onUploadStart = this.onUploadStart.bind(this);
    this.onUploadSucessed = this.onUploadSucessed.bind(this);
    this.onUploadFinished = this.onUploadFinished.bind(this);
    this.onError = this.onError.bind(this);

    this.upload(url, files);
  }

  // fetch does not support upload progress //
  // streams only work for download-progress //
  // waiting for FetchObserver //
  upload (url, files) {
    this.xhr = new XMLHttpRequest();
    this.xhr.open('POST', url, true);
    this.xhr.setRequestHeader('authorization', `Bearer ${localStorage.getItem('streamwave-token')}`);

    this.xhr.upload.addEventListener('loadstart', this.onUploadStart);
    this.xhr.upload.addEventListener('progress', this.onProgress);
    this.xhr.upload.addEventListener('load', this.onUploadSucessed);
    this.xhr.upload.addEventListener('loadend', this.onUploadFinished);
    this.xhr.addEventListener('load', this.onSuccess);
    this.xhr.addEventListener('error', this.onError);

    this.xhr.send(files);
  }

  onUploadStart (evt) {
    this.emit('upload-started');
  }

  onProgress (evt) {
    if (!evt.lengthComputable) {
      console.warn('[Upload Progress] Unknown total size.');
      return;
    }

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

  onSuccess (evt) {
    console.log('Request successed');
  }

  onError (evt) {
    console.error('Error when uploading...');
  }

  abort () {
    return this.xhr.abort();
  }
}

export default Uploader;
