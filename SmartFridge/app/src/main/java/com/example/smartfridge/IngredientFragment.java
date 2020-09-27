package com.example.smartfridge;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.GridView;
import android.widget.HorizontalScrollView;

import static java.util.Objects.isNull;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link IngredientFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class IngredientFragment extends Fragment {
    HorizontalScrollView scrollView;
    GridView gridView;
    SQLiteDatabase sqLiteDatabase;
    int fridgeCap;
    int fridgeCapExp;


//    String[] name = new String[]{"Steak", "Carrot", "Onion", "Mushroom", "Chicken", "Shit", "Rice","Carrot","Carrot","Carrot","Carrot","Carrot","Carrot","Carrot","Carrot"};
//    int[] image = new int[]{R.drawable.ic_baseline_fastfood_50, R.drawable.ic_baseline_fastfood_50, R.drawable.ic_baseline_fastfood_50, R.drawable.ic_baseline_fastfood_50, R.drawable.ic_baseline_fastfood_50,
//            R.drawable.ic_baseline_fastfood_50, R.drawable.ic_baseline_fastfood_50, R.drawable.ic_baseline_fastfood_50, R.drawable.ic_baseline_fastfood_50, R.drawable.ic_baseline_fastfood_50,
//            R.drawable.ic_baseline_fastfood_50, R.drawable.ic_baseline_fastfood_50, R.drawable.ic_baseline_fastfood_50, R.drawable.ic_baseline_fastfood_50, R.drawable.ic_baseline_fastfood_50,};
//    int[] expDate = new int[]{5, 8, 3, 4, 10, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1,};
//    int[] qty = new int[]{1, 2, 3, 10, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,};
    String[] name;
    int[] image;
    int[] expDate;
    int[] qty;
    Bitmap[] imageBP;
    int[] imageNull;
    int[] ingredientID;
    String[] nameExp;
    int[] imageExp;
    Bitmap[] imageBPExp;
    int[] imageNullExp;
    private Button btnAll;
    private Button btnVegetable;
    private Button btnMeat;
    private Button btnFruit;
    private Button btnCondiment;
    private Button btnSnack;
    int ingredientDeleteID;

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public IngredientFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment IngredientFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static IngredientFragment newInstance(String param1, String param2) {
        IngredientFragment fragment = new IngredientFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    public void filterIngredient(String ingreCategory, SQLiteDatabase sqLiteDatabase) {
        String sql;
        String sqlExpSoon;
        DbBitmapUtility bitmapConverter = new DbBitmapUtility();

        if (ingreCategory == "All") {
            sql = "SELECT * FROM ItemsExpDays";
            sqlExpSoon = "SELECT * FROM ItemsExpDays WHERE TimeDelta <= 7 ORDER BY TimeDelta";
        } else {
            sql = "SELECT * FROM ItemsExpDays WHERE Category = '" + ingreCategory + "'";
            sqlExpSoon = "SELECT * FROM ItemsExpDays WHERE TimeDelta <= 7 AND Category = '" + ingreCategory + "' ORDER BY TimeDelta";
        }

        // Update items regardless of expiration date
        Cursor c = sqLiteDatabase.rawQuery(sql, null);
        int IngredientNameIndex = c.getColumnIndex("IngredientName");
        int TimeDeltaIndex = c.getColumnIndex("TimeDelta");
        int ImageIndex = c.getColumnIndex("ImageBP");
        int QuantityIndex = c.getColumnIndex("Amount");
        int CategoryIndex = c.getColumnIndex("Category");
        int IngredientIDIndex = c.getColumnIndex("ID");

        fridgeCap = c.getCount();

        name = new String[fridgeCap];
        image = new int[fridgeCap];
        expDate = new int[fridgeCap];
        qty = new int[fridgeCap];
        imageBP = new Bitmap[fridgeCap];
        imageNull = new int[fridgeCap];
        ingredientID = new int[fridgeCap];

        int i = 0;
        c.moveToFirst();

        while (!c.isAfterLast()) {
            name[i] = c.getString(IngredientNameIndex);
            image[i] = R.drawable.ic_baseline_fastfood_50;
            expDate[i] = c.getInt(TimeDeltaIndex);
            qty[i] = c.getInt(QuantityIndex);
            ingredientID[i] = c.getInt(IngredientIDIndex);
            if (c.isNull(ImageIndex)) {
                imageBP[i] = BitmapFactory.decodeResource(getResources(), R.drawable.ic_baseline_fastfood_50);
                imageNull[i] = 1;
            } else {
                imageBP[i] = bitmapConverter.getImage(c.getBlob(ImageIndex));
                imageNull[i] = 0;
            }
            i++;
            c.moveToNext();
        }
        c.close();

        // Update items expiring soon
        Cursor cExp = sqLiteDatabase.rawQuery(sqlExpSoon, null);
        int IngredientNameIndexExp = c.getColumnIndex("IngredientName");
        int ImageIndexExp = c.getColumnIndex("ImageBP");

        fridgeCapExp = cExp.getCount();

        nameExp = new String[fridgeCapExp];
        imageExp = new int[fridgeCapExp];
        imageBPExp = new Bitmap[fridgeCapExp];
        imageNullExp = new int[fridgeCapExp];

        int iExp = 0;
        cExp.moveToFirst();

        while (!cExp.isAfterLast()) {
            nameExp[iExp] = cExp.getString(IngredientNameIndexExp);
            imageExp[iExp] = R.drawable.ic_baseline_fastfood_50;
            if (cExp.isNull(ImageIndex)) {
                imageBPExp[iExp] = BitmapFactory.decodeResource(getResources(), R.drawable.ic_baseline_fastfood_50);
                imageNullExp[iExp] = 1;
            } else {
                imageBPExp[iExp] = bitmapConverter.getImage(cExp.getBlob(ImageIndex));
                imageNullExp[iExp] = 0;
            }

            iExp++;
            cExp.moveToNext();
        }
        cExp.close();

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }

    }


    @RequiresApi(api = Build.VERSION_CODES.N)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        final View view = inflater.inflate(R.layout.fragment_ingredient, container, false);

        sqLiteDatabase = sqLiteDatabase.openDatabase("/data/data/com.example.smartfridge/databases/smartfridge", null, 0);
        filterIngredient("All", sqLiteDatabase);

        IngredientAdapter gridAdapter = new IngredientAdapter(name, image, qty, expDate, getActivity(), imageBP, imageNull);
        gridView = (GridView) view.findViewById(R.id.ingredientGrid);
        gridView.setAdapter(gridAdapter);

        // Adapter Setting for both GridView and RecyclerView ///////////////////////////////////

        LinearLayoutManager layoutManager = new LinearLayoutManager(getActivity(), LinearLayoutManager.HORIZONTAL, false);
        RecyclerView recyclerView = view.findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(layoutManager);
        RecyclerViewAdapter adapter = new RecyclerViewAdapter(nameExp, imageExp, getActivity(), imageBP, imageNull);
        recyclerView.setAdapter(adapter);

        // Delete on long click//////////////////////////////////////////////////////////////////

        gridView.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {

                new AlertDialog.Builder(getActivity())
                        .setIcon(android.R.drawable.ic_delete)
                        .setTitle("Are you sure?")
                        .setMessage("Do you want to delete this ingredient?")
                        .setPositiveButton("Delete", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                ingredientDeleteID = ingredientID[position];
                                sqLiteDatabase.execSQL("UPDATE FactFridge SET InFridge = 0 WHERE ID = " + Integer.toString(ingredientDeleteID));
//                                adapter.notifyDataSetChanged();
////                                gridAdapter.notifyDataSetChanged();
                            }
                        })
                        .setNegativeButton("No", null)
                        .show();

                return false;
            }
        });


        btnAll = (Button) view.findViewById(R.id.btnAll);
        btnAll.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filterIngredient("All", sqLiteDatabase);
                gridView = (GridView) view.findViewById(R.id.ingredientGrid);
                gridView.setAdapter(new IngredientAdapter(name, image, qty, expDate, getActivity(), imageBP, imageNull));
                RecyclerViewAdapter adapter = new RecyclerViewAdapter(nameExp, imageExp, getActivity(), imageBP, imageNull);
                recyclerView.setAdapter(adapter);
            }
        });
        btnVegetable = (Button) view.findViewById(R.id.btnVegetable);
        btnVegetable.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filterIngredient(btnVegetable.getText().toString(), sqLiteDatabase);
                gridView = (GridView) view.findViewById(R.id.ingredientGrid);
                gridView.setAdapter(new IngredientAdapter(name, image, qty, expDate, getActivity(), imageBP, imageNull));
                RecyclerViewAdapter adapter = new RecyclerViewAdapter(nameExp, imageExp, getActivity(), imageBP, imageNull);
                recyclerView.setAdapter(adapter);
            }
        });
        btnMeat = (Button) view.findViewById(R.id.btnMeat);
        btnMeat.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filterIngredient(btnMeat.getText().toString(), sqLiteDatabase);
                gridView = (GridView) view.findViewById(R.id.ingredientGrid);
                gridView.setAdapter(new IngredientAdapter(name, image, qty, expDate, getActivity(), imageBP, imageNull));
                RecyclerViewAdapter adapter = new RecyclerViewAdapter(nameExp, imageExp, getActivity(), imageBP, imageNull);
                recyclerView.setAdapter(adapter);
            }
        });
        btnCondiment = (Button) view.findViewById(R.id.btnCondiment);
        btnCondiment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filterIngredient(btnCondiment.getText().toString(), sqLiteDatabase);
                gridView = (GridView) view.findViewById(R.id.ingredientGrid);
                gridView.setAdapter(new IngredientAdapter(name, image, qty, expDate, getActivity(), imageBP, imageNull));
                RecyclerViewAdapter adapter = new RecyclerViewAdapter(nameExp, imageExp, getActivity(), imageBP, imageNull);
                recyclerView.setAdapter(adapter);
            }
        });
        btnSnack = (Button) view.findViewById(R.id.btnSnack);
        btnSnack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filterIngredient(btnSnack.getText().toString(), sqLiteDatabase);
                gridView = (GridView) view.findViewById(R.id.ingredientGrid);
                gridView.setAdapter(new IngredientAdapter(name, image, qty, expDate, getActivity(), imageBP, imageNull));
                RecyclerViewAdapter adapter = new RecyclerViewAdapter(nameExp, imageExp, getActivity(), imageBP, imageNull);
                recyclerView.setAdapter(adapter);
            }
        });
        btnFruit = (Button) view.findViewById(R.id.btnFruit);
        btnFruit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filterIngredient(btnFruit.getText().toString(), sqLiteDatabase);
                gridView = (GridView) view.findViewById(R.id.ingredientGrid);
                gridView.setAdapter(new IngredientAdapter(name, image, qty, expDate, getActivity(), imageBP, imageNull));
                RecyclerViewAdapter adapter = new RecyclerViewAdapter(nameExp, imageExp, getActivity(), imageBP, imageNull);
                recyclerView.setAdapter(adapter);
            }
        });

        // Inflate the layout for this fragment
        return view;
    }
}