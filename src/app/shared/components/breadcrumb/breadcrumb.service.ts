import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * Generates breadcrumbs based on the current route
   * @returns Observable of Breadcrumb array
   */
  generateBreadcrumbs(): Observable<Breadcrumb[]> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
      map(() => this.createBreadcrumbs(this.activatedRoute.root))
    );
  }

  /**
   * Creates breadcrumbs from the current route
   * @param route Current activated route
   * @returns Array of Breadcrumb objects
   */
  private createBreadcrumbs(route: ActivatedRoute): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Home', url: '' }  // Always start with a home breadcrumb
    ];

    // Get the current URL
    const url = this.router.url;
    
    // Split the URL into segments
    const urlSegments = url.split('/').filter(segment => segment !== '');
    
    // Build cumulative URLs for each segment
    let cumulativeUrl = '';
    urlSegments.forEach((segment, index) => {
      cumulativeUrl += `/${segment}`;
      
      // Find the route that matches this cumulative URL
      const matchedRoute = this.findRouteByUrl(this.activatedRoute.root, cumulativeUrl);
      
      // Get label from route data or generate from segment
      const label = this.getBreadcrumbLabel(matchedRoute, segment);
      
      breadcrumbs.push({
        label,
        url: cumulativeUrl.substring(1)  // Remove leading slash
      });
    });

    return breadcrumbs;
  }

  /**
   * Retrieves the breadcrumb label for a route
   * @param route Matched route
   * @param fallbackLabel Fallback label if no custom label found
   * @returns Breadcrumb label
   */
  private getBreadcrumbLabel(route: ActivatedRoute | null, fallbackLabel: string): string {
    // Check for custom breadcrumb in route data
    if (route && route.snapshot.data['breadcrumb']) {
      return route.snapshot.data['breadcrumb'];
    }

    // Fallback to formatted segment
    return this.formatLabel(fallbackLabel);
  }

  /**
   * Finds a route that matches the given URL
   * @param route Starting route to search from
   * @param url URL to match
   * @returns Matched ActivatedRoute or null
   */
  private findRouteByUrl(route: ActivatedRoute, url: string): ActivatedRoute | null {
    // Check current route and its children recursively
    const fullPath = this.getFullRoutePath(route);
    
    // If current route matches, return it
    if (fullPath === url.substring(1)) {
      return route;
    }

    // Search children
    for (const child of route.children) {
      const matchedChild = this.findRouteByUrl(child, url);
      if (matchedChild) {
        return matchedChild;
      }
    }

    return null;
  }

  /**
   * Constructs the full path for a route
   * @param route Route to get path for
   * @returns Full route path
   */
  private getFullRoutePath(route: ActivatedRoute): string {
    const pathSegments: string[] = [];
    let currentRoute: ActivatedRoute | null = route;

    while (currentRoute) {
      // Get URL segments for this route
      const segments = currentRoute.snapshot.url.map(segment => segment.path);
      
      // Prepend segments to maintain correct order
      pathSegments.unshift(...segments);
      
      // Move to parent route
      currentRoute = currentRoute.parent;
    }

    return pathSegments.join('/');
  }

  /**
   * Formats route path into a readable label
   * @param path Route path
   * @returns Formatted label
   */
  private formatLabel(path: string): string {
    return path
      .split(/[-/]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}