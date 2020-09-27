package com.example.smartfridge;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Paint;
import android.location.Location;
import android.media.Image;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;

import android.os.Handler;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.Toolbar;

import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link ShoppingFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ShoppingFragment extends Fragment implements OnMapReadyCallback {
    private MapView mMapView;

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    public static final String MAPVIEW_BUNDLE_KEY = "MapViewBundleKey";

    ArrayList<ShoppingListItem> shoppingList = null;
    ArrayAdapter<ShoppingListItem> adapter = null;
    ListView lv = null;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public ShoppingFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ShoppingFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static ShoppingFragment newInstance(String param1, String param2) {
        ShoppingFragment fragment = new ShoppingFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_shopping, container, false);

        shoppingList = getArrayVal(view.getContext());
//        Collections.addAll Toothpaste");
        Collections.sort(shoppingList);
        updateLblEmptyVisibility(view);
//        adapter = new ArrayAdapter(view.getContext(), android.R.layout.simple_list_item_1, shoppingList);
        adapter = new MyListAdapter(view.getContext(), R.layout.list_item, shoppingList);
        lv = (ListView) view.findViewById(R.id.ListView);
        lv.setAdapter(adapter);

        // Add Item
        ImageButton btnAdd = (ImageButton) view.findViewById(R.id.btnAdd);
        btnAdd.setOnClickListener((_view) -> {
//            Snackbar.make(_view, "Replace with your own action", Snackbar.LENGTH_LONG)
//                    .setAction("Action", null).show();
            AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
            builder.setTitle("Add Item");
            final EditText input = new EditText(view.getContext());
            builder.setView(input);
            builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    shoppingList.add(preferredCase(new ShoppingListItem(input.getText().toString(), false)));
                    Collections.sort(shoppingList);
                    storeArrayVal(shoppingList, view.getContext());
                    lv.setAdapter(adapter);
                    updateLblEmptyVisibility(view);
                }
            });
            builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    dialogInterface.cancel();
                }
            });
            builder.show();
        });

        // Delete All
        ImageButton btnDeleteAll = (ImageButton) view.findViewById(R.id.btnDeleteAll);
        btnDeleteAll.setOnClickListener((_view) -> {
//            Snackbar.make(_view, "Replace with your own action", Snackbar.LENGTH_LONG)
//                    .setAction("Action", null).show();
            AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
            builder.setTitle("Delete All?");
            final EditText input = new EditText(view.getContext());
            builder.setView(input);
            builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    shoppingList.clear();
                    Collections.sort(shoppingList);
                    storeArrayVal(shoppingList, view.getContext());
                    lv.setAdapter(adapter);
                    updateLblEmptyVisibility(view);
                }
            });
            builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    dialogInterface.cancel();
                }
            });
            builder.show();
        });
        mMapView = view.findViewById(R.id.user_list_map);
        // Set up MapView
        initGoogleMap(savedInstanceState);
        return view;
    }

    public static ShoppingListItem preferredCase(ShoppingListItem original) {
        if (original.itemName.isEmpty()) {
            return original;
        }
        original.itemName = original.itemName.substring(0, 1).toUpperCase() + original.itemName.substring(1).toLowerCase();
        return original;
    }

    public static void storeArrayVal(ArrayList inArrayList, Context context) {
        SharedPreferences WordSearchPutPrefs = context.getSharedPreferences("dbArrayValues", Activity.MODE_PRIVATE);
        String itemsJSONString = new Gson().toJson(inArrayList);
        SharedPreferences.Editor prefEditor = WordSearchPutPrefs.edit();
        prefEditor.putString("myArray4", itemsJSONString);
        prefEditor.commit();
    }

    public static ArrayList getArrayVal(Context dan) {
        SharedPreferences WordSearchGetPrefs = dan.getSharedPreferences("dbArrayValues", Activity.MODE_PRIVATE);
        String itemsJSONString = WordSearchGetPrefs.getString("myArray4", null);
        Type type = new TypeToken<List<ShoppingListItem>>() {}.getType();
        List <ShoppingListItem> items = new Gson().fromJson(itemsJSONString, type);
        if (items == null) {
            return new ArrayList<ShoppingListItem>();
        }
        return new ArrayList<ShoppingListItem>(items);
    }

    public void removeElement(final int position, View view) {
        AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
        builder.setTitle("Remove " + shoppingList.get(position).itemName + "?");
        builder.setPositiveButton("Yes", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                shoppingList.remove(position);
                Collections.sort(shoppingList);
                storeArrayVal(shoppingList, view.getContext());
                lv.setAdapter(adapter);
                updateLblEmptyVisibility(view);
            }
        });
        builder.setNegativeButton("No", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.cancel();
            }
        });
        builder.show();
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        Bundle mapViewBundle = outState.getBundle(MAPVIEW_BUNDLE_KEY);
        if (mapViewBundle == null) {
            mapViewBundle = new Bundle();
            outState.putBundle(MAPVIEW_BUNDLE_KEY, mapViewBundle);
        }

        mMapView.onSaveInstanceState(mapViewBundle);
    }

    @Override
    public void onResume() {
        super.onResume();
        mMapView.onResume();
    }

    @Override
    public void onStart() {
        super.onStart();
        mMapView.onStart();
    }

    @Override
    public void onStop() {
        super.onStop();
        mMapView.onStop();
    }

    @Override
    public void onMapReady(GoogleMap map) {
        map.addMarker(new MarkerOptions().position(new LatLng(39.961474, -75.262882)).title("H Mart Upper Darby"));
        map.addMarker(new MarkerOptions().position(new LatLng(39.936704, -75.162215)).title("Hung Vuong Supermarket"));
        map.addMarker(new MarkerOptions().position(new LatLng(39.953248, -75.159444)).title("Reading Terminal Market #1"));
//        if (ActivityCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_FINE_LOCATION)
//                != PackageManager.PERMISSION_GRANTED
//                && ActivityCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_COARSE_LOCATION)
//                != PackageManager.PERMISSION_GRANTED) {
//            // TODO: Consider calling
//            //    ActivityCompat#requestPermissions
//            // here to request the missing permissions, and then overriding
//            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
//            //                                          int[] grantResults)
//            // to handle the case where the user grants the permission. See the documentation
//            // for ActivityCompat#requestPermissions for more details.
//            return;
//        }
//        map.setMyLocationEnabled(true);
        map.setMinZoomPreference(10.0f);
        map.setMaxZoomPreference(14.0f);
        map.moveCamera(CameraUpdateFactory.newLatLng(new LatLng(39.961474, -75.262882)));
    }

    @Override
    public void onPause() {
        mMapView.onPause();
        super.onPause();
    }

    @Override
    public void onDestroy() {
        mMapView.onDestroy();
        super.onDestroy();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mMapView.onLowMemory();
    }

    private class MyListAdapter extends ArrayAdapter<ShoppingListItem> {
        ViewHolder mainViewHolder = null;
        private int layout;
        private MyListAdapter(Context context, int source, List<ShoppingListItem> objects) {
            super(context, source, objects);
            layout = source;
        }

        @NonNull
        @Override
        public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
            LayoutInflater inflater = (LayoutInflater)getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            View row = inflater.inflate(layout, parent, false);

            CheckBox checkBox = row.findViewById(R.id.item_list_checkbox);

            checkBox.setText(shoppingList.get(position).itemName);
            checkBox.setChecked(shoppingList.get(position).isChecked);
            if (checkBox.isChecked()) {
                checkBox.setPaintFlags(checkBox.getPaintFlags() | Paint.STRIKE_THRU_TEXT_FLAG);
            }
            checkBox.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
//                    Toast.makeText(getContext(), "Clicked", Toast.LENGTH_SHORT).show();
                    if (((CheckBox) view).isChecked()) {
                        ShoppingListItem clone = shoppingList.get(position);
                        clone.isChecked = true;
                        shoppingList.set(position, clone);
                        Collections.sort(shoppingList);
                        storeArrayVal(shoppingList, view.getContext());
                        lv.setAdapter(adapter);
                    }
                    else {
                        Log.d("dfasdf", "unchecked");
                        ShoppingListItem clone = shoppingList.get(position);
                        clone.isChecked = false;
                        shoppingList.set(position, clone);
                        Collections.sort(shoppingList);
                        storeArrayVal(shoppingList, view.getContext());
                        lv.setAdapter(adapter);
                    }
                }
            });
            checkBox.setOnLongClickListener(new View.OnLongClickListener() {
                @Override
                public boolean onLongClick(View view) {
                    removeElement(position, view);
                    return true;
                }
            });
            return row;
        }
    }

    public class ViewHolder {
        CheckBox checkBox;
    }

    private void initGoogleMap(Bundle savedInstanceState){
        // *** IMPORTANT ***
        // MapView requires that the Bundle you pass contain _ONLY_ MapView SDK
        // objects or sub-Bundles.
        Bundle mapViewBundle = null;
        if (savedInstanceState != null) {
            mapViewBundle = savedInstanceState.getBundle(MAPVIEW_BUNDLE_KEY);
        }

        mMapView.onCreate(mapViewBundle);

        mMapView.getMapAsync(this);
    }

    private void updateLblEmptyVisibility(View view) {
        if (shoppingList.size() == 0) {
            ListView itemsList = (ListView)view.findViewById(R.id.ListView);
            itemsList.setVisibility(View.INVISIBLE);
            TextView lblEmpty = (TextView)view.findViewById(R.id.lblEmpty);
            lblEmpty.setVisibility(View.VISIBLE);
        }
        else {
            ListView itemsList = (ListView)view.findViewById(R.id.ListView);
            itemsList.setVisibility(View.VISIBLE);
            TextView lblEmpty = (TextView)view.findViewById(R.id.lblEmpty);
            lblEmpty.setVisibility(View.INVISIBLE);
        }
    }
}