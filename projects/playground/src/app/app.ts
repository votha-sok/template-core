import { Component, inject, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FRAMEWORK_VERSION } from 'ui-utils';
import { ThemeService } from 'ui-theme';
import { CuiIconComponent, IconRegistryService } from 'ui-icons';
import { MenuService, MenuItem, ToastService, LoadingService, BreadcrumbService, PermissionService } from 'ui-utils';

import {
  // Wave 1
  CuiButtonComponent, CuiBadgeComponent, CuiAvatarComponent,
  CuiSkeletonComponent, CuiProgressComponent,
  CuiChipComponent, CuiTooltipDirective,
  // Wave 2
  CuiToastOutletComponent, CuiLoadingOverlayComponent, CuiEmptyStateComponent,
  // Wave 3
  CuiCardComponent, CuiBreadcrumbComponent, CuiPaginationComponent,
  CuiInputComponent, CuiSelectComponent, CuiDatepickerComponent,
  CuiTabsComponent, CuiDialogContainerComponent, CuiDrawerComponent,
  CuiDataTableComponent,
  SelectOption, TabItem, TableColumn, PageEvent, DataTableChangeEvent, SortState,
} from 'ui-core';

const CUSTOM_ICONS = [
  { name: 'shield',       svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l6 2.67V11c0 3.87-2.64 7.5-6 8.93C8.64 18.5 6 14.87 6 11V7.67L12 5z"/></svg>` },
  { name: 'aml-flag',    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/></svg>` },
  { name: 'company-logo',svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="currentColor"><rect x="4" y="4" width="14" height="14" rx="2"/><rect x="22" y="4" width="14" height="14" rx="2" opacity="0.6"/><rect x="4" y="22" width="14" height="14" rx="2" opacity="0.6"/><rect x="22" y="22" width="14" height="14" rx="2" opacity="0.3"/></svg>` },
];

const APP_MENU: MenuItem[] = [
  { id: 'dashboard',   label: 'Dashboard',   icon: 'dashboard',  routerLink: '/' },
  { id: 'monitoring',  label: 'Monitoring',  icon: 'radar',      expanded: true,  children: [
    { id: 'alerts',       label: 'Alerts',       icon: 'aml-flag',    routerLink: '/alerts',       badge: '12', badgeColor: 'error' },
    { id: 'transactions', label: 'Transactions', icon: 'swap_horiz',  routerLink: '/transactions' },
  ]},
  { id: 'reports',  label: 'Reports',  icon: 'bar_chart',  routerLink: '/reports',  dividerBefore: true },
  { id: 'users',    label: 'Users',    icon: 'people',     routerLink: '/users',    permission: 'users:read' },
  { id: 'settings', label: 'Settings', icon: 'settings',   routerLink: '/settings', dividerBefore: true },
];

export interface CaseRow {
  id: string; caseNo: string; subject: string; status: string;
  risk: string; assignee: string; created: string; [key: string]: unknown;
}

const CASES: CaseRow[] = [
  { id:'1', caseNo:'AML-2401', subject:'Suspicious wire transfer',    status:'Open',   risk:'High',   assignee:'Alice B',  created:'2024-01-15' },
  { id:'2', caseNo:'AML-2402', subject:'Unusual cash deposits',       status:'Review', risk:'Medium', assignee:'Bob C',    created:'2024-01-16' },
  { id:'3', caseNo:'AML-2403', subject:'Shell company transactions',  status:'Closed', risk:'Low',    assignee:'Carol D',  created:'2024-01-17' },
  { id:'4', caseNo:'AML-2404', subject:'Cross-border payment flag',   status:'Open',   risk:'High',   assignee:'David E',  created:'2024-01-18' },
  { id:'5', caseNo:'AML-2405', subject:'Crypto exchange activity',    status:'Review', risk:'Medium', assignee:'Eva F',    created:'2024-01-19' },
];

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, ReactiveFormsModule,
    CuiIconComponent, CuiTooltipDirective,
    // Wave 1
    CuiButtonComponent, CuiBadgeComponent, CuiAvatarComponent,
    CuiSkeletonComponent, CuiProgressComponent, CuiChipComponent,
    // Wave 2
    CuiToastOutletComponent, CuiLoadingOverlayComponent, CuiEmptyStateComponent,
    // Wave 3
    CuiCardComponent, CuiBreadcrumbComponent, CuiPaginationComponent,
    CuiInputComponent, CuiSelectComponent, CuiDatepickerComponent,
    CuiTabsComponent, CuiDialogContainerComponent, CuiDrawerComponent,
    CuiDataTableComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly frameworkVersion   = inject(FRAMEWORK_VERSION);
  readonly themeService       = inject(ThemeService);
  readonly menuService        = inject(MenuService);
  readonly toastService       = inject(ToastService);
  readonly loadingService     = inject(LoadingService);
  readonly breadcrumbService  = inject(BreadcrumbService);
  readonly permissionService  = inject(PermissionService);
  private readonly iconRegistry = inject(IconRegistryService);
  private readonly fb           = inject(FormBuilder);

  // ── Demo state ─────────────────────────────────────────────────────────────
  readonly activeTab    = signal(0);
  readonly drawerOpen   = signal(false);
  readonly dialogOpen   = signal(false);
  readonly cardLoading  = signal(false);
  readonly tablePage    = signal(1);
  readonly tableTotal   = signal(CASES.length);
  readonly progress     = signal(72);
  readonly Math         = Math;

  readonly form = this.fb.group({
    name:  ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    risk:  [null as string | null],
    date:  [null as Date | null],
  });

  // ── Select options ─────────────────────────────────────────────────────────
  readonly riskOptions: SelectOption[] = [
    { value: 'low',    label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high',   label: 'High Risk',   group: 'Critical' },
    { value: 'severe', label: 'Severe Risk',  group: 'Critical' },
  ];

  // ── Tabs ───────────────────────────────────────────────────────────────────
  readonly tabs: TabItem[] = [
    { id: 'overview',  label: 'Overview',  icon: 'dashboard' },
    { id: 'forms',     label: 'Forms',     icon: 'edit_note',  badge: 'NEW' },
    { id: 'data',      label: 'Data',      icon: 'table_chart' },
    { id: 'overlays',  label: 'Overlays',  icon: 'layers' },
  ];

  // ── Table columns ──────────────────────────────────────────────────────────
  readonly columns: TableColumn<CaseRow>[] = [
    { key: 'caseNo',   header: 'Case No.',   sortable: true,  width: '110px' },
    { key: 'subject',  header: 'Subject',    sortable: true  },
    { key: 'status',   header: 'Status',     sortable: true,  width: '100px', align: 'center' },
    { key: 'risk',     header: 'Risk',       sortable: true,  width: '100px', align: 'center' },
    { key: 'assignee', header: 'Assignee',   sortable: false, width: '120px' },
    { key: 'created',  header: 'Created',    sortable: true,  width: '110px' },
  ];

  readonly tableRows = signal<CaseRow[]>(CASES);

  ngOnInit(): void {
    this.iconRegistry.registerAll(CUSTOM_ICONS);
    this.menuService.setItems(APP_MENU);
    this.menuService.activateByUrl('/alerts');
    this.permissionService.setPermissions(['users:read']);
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Home', routerLink: '/' },
      { label: 'Cases', routerLink: '/cases' },
      { label: 'AML Dashboard', isCurrent: true },
    ]);
  }

  toast(level: 'success'|'error'|'warning'|'info'): void {
    const msgs = {
      success: 'Case closed successfully.',
      error:   'Transaction verification failed.',
      warning: 'Suspicious activity detected.',
      info:    'Report generation scheduled.',
    };
    this.toastService[level](msgs[level], { title: level.charAt(0).toUpperCase() + level.slice(1) });
  }

  onTableChange(e: DataTableChangeEvent): void {
    console.log('DataTable state:', e);
  }

  onPageChange(e: PageEvent): void {
    this.tablePage.set(e.page);
  }

  simulateLoad(): void {
    this.cardLoading.set(true);
    setTimeout(() => this.cardLoading.set(false), 2000);
  }

  submitForm(): void {
    if (this.form.valid) {
      this.toast('success');
    } else {
      this.form.markAllAsTouched();
    }
  }
}
