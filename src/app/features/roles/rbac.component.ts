import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "#app/shared/material/material.module";
import { RolesListComponent } from "./roles/roles-list/roles-list.component";
import { ResourcesListComponent } from "./resources/resources-list/resources-list.component";
import { PermissionsListComponent } from "./permissions/permissions-list/permissions-list.component";

@Component({
  selector: 'app-rbac-management',
  templateUrl: './rbac.component.html',
  imports: [
    CommonModule,
    MaterialModule,
    RolesListComponent,
    ResourcesListComponent,
    PermissionsListComponent,
  ]
})
export class RbacComponent {

}