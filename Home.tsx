import { useState, useEffect } from 'react';
import { TaxRecord, taxesApi } from '@/services/api';
import CustomerTable from '@/components/Table/CustomerTable';
import EditCustomerModal from '@/components/Modal/EditCustomerModal';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [data, setData] = useState<TaxRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<TaxRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const taxes = await taxesApi.getAll();
      setData(taxes);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (record: TaxRecord) => {
    setSelectedCustomer(record);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    loadData();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
          <p className="text-muted-foreground mt-2">
            View and manage customer information
          </p>
        </div>

        <CustomerTable data={data} isLoading={isLoading} onEdit={handleEdit} />

        <EditCustomerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          customer={selectedCustomer}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default Home;
