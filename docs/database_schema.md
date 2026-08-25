# Database Schema

## Tables
- users
- directorates
- departments
- crop_categories
- crops
- crop_products
- border_points (with PostGIS geometry)
- consignments
- inspections
- approvals
- attachments
- audit_logs
- notifications

## PostGIS
- border_points.location is a POINT(4326)
- Spatial queries use ST_Distance, ST_Within, etc.
