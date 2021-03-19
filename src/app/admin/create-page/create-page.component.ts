import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Post} from "../../shared/interfaces";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {PostService} from "../../shared/post.service";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  public Editor = ClassicEditor;

  form: FormGroup = new FormGroup({
    title: new FormControl(null, Validators.required),
    text: new FormControl(null, Validators.required),
    author: new FormControl(null, Validators.required)
  });

  constructor(
    private postService: PostService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const post: Post = {
      title: this.form.value.title,
      text: this.form.value.text,
      author: this.form.value.author,
      date: new Date(),
    };

    this.postService.create(post).subscribe(() => {
      this.form.reset();
      this.alert.success('Post created');
    });
  }

}
