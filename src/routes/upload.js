import { h, Component } from 'preact';
import Constants from '../constants';

class Upload extends Component {
  constructor () {
    super();
  }

  onClickImportButton () {
    this.input.click();
  }

  importMedias (evt) {
    const files = this.polarFileInput.files;
    if (!files) {
      return;
    }

    this.uploadMedias(files).catch(err => {
      console.error(err);
    });
  }

  async uploadMedias (files) {
    let total, downloaded = 0;

    // TODO: calculate total download
    const onStream = ({done, value}) => {
      if (done) {
        return;
      }

      downloaded += value.length;
      // TODO: update progress bar
      this.progressValue.innerText = `${Math.round((downloaded / total) * 100)}%`;
      this.progress.style.transform = `scaleX(${downloaded / total}%)`;
      return reader.read().then(onStream);
    }

    const body = new FormData();
    body.append('musics', files);

    const response = await fetch(`${Constants.API_URL}/albums/upload`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${localStorage.getItem('streamwave-token')}`
      },
      body
    });

    // track file upload progress
    const reader = response.body.getReader();
    reader.read().then(onStream);
  }

  preventOpenFile (evt) {
    evt.preventDefault();
  }

  onDragEnter (evt) {
    console.log('dragenter');
    this.dropper.classList.add('upload__drag-drop--active');
  }

  onDragEnd (evt) {
    console.log('dragexit');
    this.dropper.classList.remove('upload__drag-drop--active');
  }

  onDrop (evt) {
    evt.preventDefault();
    const files = evt.dataTransfer.files;
    if (!files) {
      return;
    }

    this.uploadMedias(files).catch(err => {
      console.error(err);
    });
  }

  render () {
    return (
      <div class="upload">
        <div
          class="upload__drag-drop"
          ref={dropper => this.dropper = dropper}
          onDragOver={this.preventOpenFile}
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragEnd={this.onDragEnd}
          onDragExit={this.onDragEnd}
        >
          <div class="upload__icon"></div>
          <p class="upload__description">
            Faites glisser les titres de votre albums
            afin de les ajouter à votre catalogue musical.
          </p>
          <div>
            <p class="upload__alternative">ou bien...</p>
            <div class="upload__button-container">
              <button
                class="upload__button"
                onClick={this.onClickImportButton}
              >
                Importer les fichiers
              </button>
              <input
                class="upload__input"
                type="file"
                ref={input => this.input = input}
                onChange={this.importMedias}
                multiple
              />
            </div>
          </div>
          <div class="upload__progress-bar">
            <div class="upload__progression-value" ref={value => this.progressValue = value}></div>
            <div class="upload__progression-track" ref={progress => this.progress = progress}></div>
          </div>
        </div>
      </div>
    );
  }
}
