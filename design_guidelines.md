# Medical Appointment System - Design Guidelines

## Design Approach: Material Design System

**Rationale**: This medical appointment system is utility-focused, requiring clarity, efficiency, and trust. Material Design provides the perfect foundation with its emphasis on data density, clear hierarchy, and professional aesthetics suitable for healthcare applications.

**Key Principles**:
- Clinical clarity over decoration
- Efficiency in appointment management workflows
- Trust through professional, consistent interface
- Scannable information architecture

---

## Typography System

**Primary Font**: Inter (Google Fonts)
- Headings: 600 weight
- Body: 400 weight  
- Emphasis: 500 weight

**Scale**:
- Page titles: text-3xl (30px)
- Section headers: text-xl (20px)
- Card titles: text-lg (18px)
- Body text: text-base (16px)
- Helper text: text-sm (14px)
- Labels: text-xs uppercase tracking-wide (12px)

---

## Layout System

**Spacing Units**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4 or p-6
- Section spacing: space-y-6 or space-y-8
- Card gaps: gap-4
- Form field spacing: space-y-4

**Grid Structure**:
- Main container: max-w-7xl mx-auto px-4
- Dashboard: 2-column layout (sidebar + main content) on desktop
- Appointment grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Forms: max-w-2xl single column

---

## Component Library

### Navigation
- **Top Bar**: Full-width header with logo left, navigation center, user profile right
- **Height**: h-16
- **Sticky positioning**: sticky top-0 z-50
- **Elements**: Logo, main nav links, notifications bell icon, user avatar dropdown

### Appointment Cards (Primary Component)
- **Structure**: Rounded corners (rounded-lg), subtle border
- **Layout**: Vertical stack with clear sections
- **Header**: Doctor name (text-lg font-semibold) + specialty badge
- **Body**: Patient name, date/time (prominent), status indicator
- **Footer**: Action buttons (View Details, Reschedule, Cancel)
- **Padding**: p-6
- **Hover state**: Subtle elevation increase

### Doctor Badges
- **Style**: Rounded-full px-3 py-1 text-xs
- **Content**: Specialty (e.g., "Cardiology", "Pediatrics")
- **Placement**: Next to doctor name or in card header

### Status Indicators
- **Format**: Inline badge or dot + text
- **States**: Pending, Confirmed, Completed, Cancelled
- **Visual**: Small dot (h-2 w-2 rounded-full) + text-sm label

### Forms
- **Structure**: Clean vertical flow with consistent spacing
- **Field Groups**: space-y-4
- **Labels**: text-sm font-medium mb-2
- **Inputs**: Full-width, h-10, rounded-md border
- **Required indicators**: Asterisk (*) in label
- **Error messages**: text-sm below field
- **Submit buttons**: Full-width on mobile, min-w-32 on desktop

### Data Tables (Appointment List View)
- **Header**: Sticky with sort indicators
- **Rows**: Alternating subtle background treatment
- **Row height**: h-16 for comfortable scanning
- **Columns**: Patient | Doctor | Date/Time | Status | Actions
- **Actions**: Icon buttons (Edit, Delete) aligned right

### Dashboard Widgets
- **Stats Cards**: Grid of key metrics (Total Appointments, Today's Schedule, Pending Confirmations)
- **Card Structure**: p-6, rounded-lg border
- **Content**: Large number (text-3xl font-bold) + label (text-sm) + trend indicator
- **Grid**: grid-cols-1 md:grid-cols-3 gap-6

### Calendar/Schedule View
- **Week View**: Primary scheduling interface
- **Time Slots**: Rows with 30-minute increments
- **Appointments**: Colored blocks with patient name overlay
- **Grid**: Clean lines separating days and time blocks

### Modals/Dialogs
- **Size**: max-w-2xl for forms, max-w-md for confirmations
- **Backdrop**: Semi-transparent overlay
- **Structure**: Header (text-xl) + content (p-6) + footer with actions
- **Close**: X icon top-right

---

## Page Layouts

### Dashboard (Landing After Login)
- 3-stat cards at top (Today, Pending, Total)
- Upcoming appointments section (card grid)
- Quick actions section (Schedule New, View Calendar)
- Recent activity feed (right sidebar on desktop)

### Appointments List
- Filters bar (Status, Date Range, Doctor)
- Search input
- Table or card view toggle
- Appointment cards in responsive grid

### New/Edit Appointment Form
- Centered max-w-2xl container
- Progressive disclosure (patient info → doctor selection → datetime → confirmation)
- Clear step indicators if multi-step
- Summary panel on desktop (sticky right sidebar)

### Doctor Management
- Doctor cards with photo placeholder, name, specialty, availability status
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4

---

## Images

**Hero Image**: Not applicable - this is a utility application focused on efficiency. Replace traditional hero with dashboard/stats overview.

**Doctor Profile Images**: 
- Circular avatars (rounded-full)
- Size: h-12 w-12 in cards, h-24 w-24 in profiles
- Placeholder: Initials in neutral background if no photo
- Placement: Doctor cards, appointment details, selection UI

**Iconography**:
- Use Heroicons (outline style for navigation, solid for status indicators)
- Consistent size: h-5 w-5 for UI icons, h-6 w-6 for feature icons
- Medical icons: stethoscope, calendar, clock, user-group

---

## Responsive Behavior

**Mobile (< 768px)**:
- Single column layouts
- Bottom navigation for primary actions
- Collapsible filters
- Full-width cards
- Simplified table to card view

**Tablet (768px - 1024px)**:
- 2-column grids
- Persistent top navigation
- Side-by-side form + preview where applicable

**Desktop (> 1024px)**:
- Full multi-column layouts
- Sidebar navigation options
- Data tables with all columns visible
- Hover states and tooltips active

---

## Interaction Patterns

**Loading States**: Skeleton screens matching component structure, not generic spinners

**Empty States**: Centered message with illustration placeholder + primary action CTA

**Error States**: Inline validation errors, toast notifications for system errors

**Success Confirmations**: Subtle toast notification top-right, auto-dismiss after 3s

**Destructive Actions**: Always require confirmation modal with clear warning

---

This design creates a professional, efficient medical appointment system that prioritizes usability, data clarity, and user trust while maintaining modern web standards.