// Notebook types and classes

// Notebook cell types
export const NotebookCellType = {
  CODE: 'code',
  MARKDOWN: 'markdown',
};

// Notebook content
export class NotebookContent {
  constructor() {
    this.cells = [];
    this.metadata = new NotebookMetadata();
  }
}

// Notebook cell
export class NotebookCell {
  constructor() {
    this.cell_type = NotebookCellType.CODE;
    this.source = '';
    this.execution_count = null;
    this.outputs = [];
    
    // Additional properties used by NotebookReadTool
    this.cellType = 'code';
    this.language = 'python';
    this.cell = 0;
  }
}

// Notebook metadata
export class NotebookMetadata {
  constructor() {
    this.language_info = { name: 'python' };
  }
}

// Notebook output
export class NotebookOutput {
  constructor() {
    this.output_type = '';
    this.data = {
      'text/plain': '',
      'image/png': '',
      'image/jpeg': '',
    };
    this.text = '';
    this.ename = '';
    this.evalue = '';
    this.traceback = [];
  }
}

// Notebook cell source
export class NotebookCellSource {
  constructor() {
    this.source = '';
    this.outputs = [];
    this.cellType = 'code';
    this.language = 'python';
    this.cell = 0;
  }
}

// Notebook output image
export class NotebookOutputImage {
  constructor() {
    this.media_type = 'image/png';
    this.image_data = '';
  }
}

// Notebook cell source output
export class NotebookCellSourceOutput {
  constructor() {
    this.output_type = '';
    this.text = '';
    this.image = new NotebookOutputImage();
  }
}

// Notebook cell output
export class NotebookCellOutput {
  constructor() {
    this.output_type = '';
    this.text = '';
    this.data = {
      'text/plain': '',
      'image/png': '',
      'image/jpeg': '',
    };
    this.ename = '';
    this.evalue = '';
    this.traceback = [];
  }
}

// Add any other types that might be needed 