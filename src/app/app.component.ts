import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    const theme = localStorage.getItem("theme");
    if (theme) document.body.classList.toggle("dark-theme");
  }
  title = "Pixelgram";
}
