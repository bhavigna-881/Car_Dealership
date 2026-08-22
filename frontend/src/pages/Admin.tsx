import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchVehicles } from '../store/slices/vehicleSlice';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { PencilSimple, Trash, Plus } from '@phosphor-icons/react';

export function Admin() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.vehicles);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your vehicle inventory.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus size={20} /> Add Vehicle
        </Button>
      </div>

      {isAdding && (
        <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Vehicle (Mock)</h2>
          <p className="text-muted-foreground mb-4">This form will be connected to the API in the next phase.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={() => setIsAdding(false)}>Save Vehicle</Button>
          </div>
        </div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Make & Model</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">No vehicles found.</TableCell>
              </TableRow>
            ) : (
              items.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.make} {vehicle.model}</TableCell>
                  <TableCell>{vehicle.category}</TableCell>
                  <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={vehicle.quantity > 0 ? 'default' : 'destructive'}>
                      {vehicle.quantity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Edit">
                        <PencilSimple size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete" className="text-destructive">
                        <Trash size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
