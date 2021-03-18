/* eslint-disable import/prefer-default-export */
import $ from 'jquery';

import { GalleryView } from '../view/GalleryView';
import { AlbumsView } from '../view/AlbumsView';
import { AlbumPhotosView } from '../view/AlbumPhotosView';
import { AlbumsModel } from '../model/AlbumsModel';
import { AlbumPhotosModel } from '../model/AlbumPhotosModel';

export class GalleryController {
    constructor() {
        this.galleryView = new GalleryView();
        this.albumsView = new AlbumsView({ createAlbumPhotos: (id) => this.createAlbumPhotos(id) });
        this.albumPhotosView = new AlbumPhotosView();
        this.albumsModel = new AlbumsModel();
        this.albumPhotosModel = new AlbumPhotosModel();
        this.renderGallery();
    }

    renderGallery() {
        const $app = $('.app');

        $app.append(this.galleryView.$container);
        this.galleryView.$container.append(this.albumsView.$albumListContainer);
        this.galleryView.$container.append(this.albumPhotosView.$albumPhotosContainer);
        this.init();
    }

    async init() {
        await this.albumsModel.sendGetAlbumListRequest()
            .then((albumList) => {
                this.albumsView.renderAlbumList(albumList);
                const firstItemId = albumList[0].id;
                return this.albumPhotosModel.sendGetAlbumPhotosRequest(firstItemId);
            })
            .then((albumPhotos) => this.albumPhotosView.renderAlbumPhotos(albumPhotos));
    }

    async createAlbumPhotos(id) {
        await this.albumPhotosModel.sendGetAlbumPhotosRequest(id)
            .then((albumPhotos) => this.albumPhotosView.renderAlbumPhotos(albumPhotos));
    }
}