import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';

interface ConsignmentDetail {
  id: number;
  reference: string;
  date: string;
  time_of_entry: string | null;
  border_point_id: number;
  officer_id: number;
  officer_name: string | null;
  crop_product_id: number;
  crop_id: number;
  directorate_id: number | null;
  department_id: number | null;
  direction: string;
  quantity: number;
  unit: string;
  standard_quantity: number | null;
  standard_unit: string | null;
  country_origin: string | null;
  country_destination: string | null;
  vehicle_reg: string | null;
  trader_company: string | null;
  transporter: string | null;
  permit_number: string | null;
  packaging_type: string | null;
  no_of_packages: number | null;
  purpose: string | null;
  variety: string | null;
  inspection_status: string | null;
  remarks: string | null;
  gps_coordinates: string | null;
  status: string;
  created_at: string;
}

export const ConsignmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ConsignmentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/consignments/${id}`).then(res => {
        setItem(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!item) return <div>Consignment not found.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Link to="/my-records" className="text-blue-600 hover:underline">← Back to My Records</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Consignment {item.reference}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Identification</h3>
          <p><strong>ID:</strong> {item.id}</p>
          <p><strong>Reference:</strong> {item.reference}</p>
          <p><strong>Date:</strong> {item.date}</p>
          <p><strong>Time:</strong> {item.time_of_entry || '-'}</p>
          <p><strong>Officer:</strong> {item.officer_name || '-'}</p>
          <p><strong>Border Point:</strong> {item.border_point_id}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Classification</h3>
          <p><strong>Directorate ID:</strong> {item.directorate_id || '-'}</p>
          <p><strong>Department ID:</strong> {item.department_id || '-'}</p>
          <p><strong>Crop ID:</strong> {item.crop_id}</p>
          <p><strong>Product ID:</strong> {item.crop_product_id}</p>
          <p><strong>Variety:</strong> {item.variety || '-'}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Consignment</h3>
          <p><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
          <p><strong>Standard Quantity:</strong> {item.standard_quantity} {item.standard_unit}</p>
          <p><strong>Direction:</strong> {item.direction}</p>
          <p><strong>Origin:</strong> {item.country_origin || '-'}</p>
          <p><strong>Destination:</strong> {item.country_destination || '-'}</p>
          <p><strong>Vehicle:</strong> {item.vehicle_reg || '-'}</p>
          <p><strong>Trader:</strong> {item.trader_company || '-'}</p>
          <p><strong>Transporter:</strong> {item.transporter || '-'}</p>
          <p><strong>Permit:</strong> {item.permit_number || '-'}</p>
          <p><strong>Packaging:</strong> {item.packaging_type || '-'}</p>
          <p><strong>Packages:</strong> {item.no_of_packages || '-'}</p>
          <p><strong>Purpose:</strong> {item.purpose || '-'}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Status</h3>
          <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs ${
            item.status === 'cleared' ? 'bg-green-100 text-green-800' :
            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            item.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>{item.status}</span></p>
          <p><strong>Inspection:</strong> {item.inspection_status || '-'}</p>
          <p><strong>Created:</strong> {item.created_at}</p>
          <p><strong>GPS:</strong> {item.gps_coordinates || '-'}</p>
          <p><strong>Remarks:</strong> {item.remarks || '-'}</p>
        </div>
      </div>
    </div>
  );
};
