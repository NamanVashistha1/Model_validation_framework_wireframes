import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

interface ModelPipelineDialogProps {
  modelId: string;
}

export function ModelPipelineDialog({ modelId }: ModelPipelineDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          See Model Pipeline
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <h2 className="text-lg font-semibold mb-4">Model Pipeline for {modelId}</h2>
        <span className="text-muted-foreground text-sm text-red-600">
  *Requirement: Here load complete MMG model pipeline screen along with the notebook for detailed review.
</span>

        <div className="flex items-center justify-around">
          <div className="bg-blue-100 p-4 rounded-lg">Data Input</div>
          <div className="border-t-2 border-blue-500 flex-1 mx-2" />
          <div className="bg-blue-100 p-4 rounded-lg">Feature Engineering</div>
          <div className="border-t-2 border-blue-500 flex-1 mx-2" />
          <div className="bg-blue-100 p-4 rounded-lg">Model Training</div>
          <div className="border-t-2 border-blue-500 flex-1 mx-2" />
          <div className="bg-blue-100 p-4 rounded-lg">Validation</div>
          <div className="border-t-2 border-blue-500 flex-1 mx-2" />
          <div className="bg-blue-100 p-4 rounded-lg">Deployment</div>
          <div className="border-t-2 border-blue-500 flex-1 mx-2" />
          <div className="bg-blue-100 p-4 rounded-lg">Monitoring</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
